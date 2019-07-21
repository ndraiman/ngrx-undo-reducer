import { HistoryState, UndoableOptions } from '../models';
import deepEqual from 'fast-deep-equal';
import { Actions, Bookmark } from '../actions/actions';
import {
	applyOptions,
	createHistory,
	Debug,
	getSkipReducer,
	insert,
	isClearHistoryType,
	isInitType,
	isRevertToBookmarkType,
	jump,
	newHistory
} from '../helpers';
import { Action, ActionReducer } from '../internal';

export function undoable<T, V extends Action = Action>(
	reducer: ActionReducer<T, V>,
	options: Partial<UndoableOptions<T>> = {}
): ActionReducer<HistoryState<T>, V> {
	const initialState: HistoryState<T> = createHistory(reducer(undefined, {} as any), null);
	const config: UndoableOptions<T> = applyOptions(options);
	const debug = new Debug(config.debug);
	const skipReducer = getSkipReducer<T, V>(config.neverSkipReducer);

	return function(state: HistoryState<T> = initialState, action: V | Actions<T>): HistoryState<T> {
		debug.start(action, state);

		switch (action.type) {
			case config.undoType: {
				const res = jump(state, -1);
				debug.log('perform undo');
				debug.end(res);
				return skipReducer(reducer, res, action);
			}

			case config.redoType: {
				const res = jump(state, 1);
				debug.log('perform redo');
				debug.end(res);
				return skipReducer(reducer, res, action);
			}

			case isClearHistoryType(action.type, config.clearHistoryTypes): {
				const res: HistoryState<T> = createHistory(state.present, state.bookmark);
				debug.log('perform clearHistory');
				debug.end(res, 'Cleared History');
				return skipReducer(reducer, res, action);
			}

			case config.bookmarkType: {
				const bookmarked = (action as Bookmark<T>).payload || state.present;
				const res = createHistory(state.present, bookmarked);
				debug.log('Bookmarked state');
				debug.end(res, 'Bookmarked');
				return res;
			}

			case isInitType(action.type, config.initTypes):
				debug.log('reset history due to init action');
				debug.end(initialState, 'InitType');
				return initialState;

			case isRevertToBookmarkType(action.type, config.revertToBookmarkTypes): {
				if (!state.bookmark) {
					throw new Error('Bookmark is undefined');
				}

				const res = createHistory(state.bookmark, state.bookmark);
				debug.log('revert to Bookmark state');
				debug.end(res, 'Reset to Bookmark');
				return res;
			}

			default: {
				const newPresent = reducer(state.present, action as V);
				if (deepEqual(state.present, newPresent)) {
					return state;
				}

				const filtered = typeof config.filter === 'function' && !config.filter(action, newPresent, state);
				if (filtered) {
					// if filtering an action, just update the present
					const filteredState = newHistory(state.past, newPresent, state.future, state.bookmark);
					debug.log('filter ignored action, not storing it in past: ', action.type);
					debug.end(filteredState, 'Filtered');
					return filteredState;
				}

				const res: HistoryState<T> = insert(state, newPresent, config.limit, debug);
				debug.log('inserted new state into history');
				debug.end(res, 'Inserted');
				return res;
			}
		}
	};
}
