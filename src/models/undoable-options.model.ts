import { HistoryState } from './history-state.model';
import { ActionTypes } from '../actions/actions';
import { Action } from '../internal';

export interface UndoableOptions<T> {
	/**
	 * Define a custom action type for the undo action
	 */
	undoType: string | ActionTypes.Undo;
	/**
	 * Define a custom action type for the redo action
	 */
	redoType: string | ActionTypes.Redo;
	/**
	 * Define action type that would bookmark the state passed via action.payload or will take state.present if no payload was passed.
	 */
	bookmarkType: string | ActionTypes.Bookmark;
	/**
	 * Define action types that would clear the state history
	 */
	clearHistoryTypes: string[] | [ActionTypes.ClearHistory];
	/**
	 * Define action types that would revert state to the bookmarked state
	 */
	revertToBookmarkTypes: string[] | [ActionTypes.RevertToBookmark];
	/**
	 * Set to `true` to turn on debugging
	 */
	debug: boolean;
	/**
	 * Set to a number to turn on a limit for the history
	 */
	limit: number | undefined;
	/**
	 * A filter function that will determine if the action is included in the undo/redo history
	 */
	filter: FilterFunction<T>;
	/**
	 * Define action types that will revert to initialState
	 */
	initTypes: string[];
	/**
	 * Prevent skipping the reducer on undo/redo and clearHistoryType actions
	 */
	neverSkipReducer: boolean;
}

export type FilterFunction<T = any> = (action: Action, currentState: T, previousHistory: HistoryState<T>) => boolean;
