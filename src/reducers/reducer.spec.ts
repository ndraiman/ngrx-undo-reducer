import { undoable } from './reducer';
import { createHistory, excludeActions, includeActions, newHistory } from '../helpers';
import { HistoryState } from '../models';
import { ActionsCreator } from '..';
import { ActionReducer } from '../internal';

describe('Undoable Reducer', () => {
	const excludedAction = { type: 'dec' };
	const includedAction = { type: 'inc' };
	function mockReducer(state: number = 0, action: any) {
		switch (action.type) {
			case 'inc':
				return state + 1;

			case 'dec':
				return state - 1;

			default:
				return state;
		}
	}
	let undoableReducer: ActionReducer<HistoryState<number>>;

	beforeEach(() => {
		undoableReducer = undoable(mockReducer, { debug: true, filter: excludeActions(excludedAction.type) });
	});

	describe('unknown action', () => {
		it('should return the same state', () => {
			const state = createHistory(5, null);
			const result = undoableReducer(state, {} as any);
			expect(result).toEqual(state);
		});
	});

	describe('reducer action', () => {
		it('should return the history state', () => {
			const initialState = createHistory(0, null);
			const result = undoableReducer(initialState, { type: 'inc' });
			expect(result).toEqual(newHistory([0], 1, [], null));
		});
	});

	describe('filtered action', () => {
		it('should not update history for excluded action', () => {
			const state = newHistory([0], 1, [2], null);
			const result = undoableReducer(state, excludedAction);
			expect(result).toEqual(newHistory([0], 0, [2], null));
		});

		it('should not update history for non-included action', () => {
			const mockUndoableReducer = undoable(mockReducer, { debug: true, filter: includeActions(includedAction.type) });

			const state = newHistory([0], 1, [2], null);
			const result = mockUndoableReducer(state, { type: 'dec' });
			expect(result).toEqual(newHistory([0], 0, [2], null));
		});
	});

	describe('undo action', () => {
		it('should return the previous state', () => {
			const state = newHistory([0], 1, [], null);
			const result = undoableReducer(state, ActionsCreator.undo());
			expect(result).toEqual(newHistory([], 0, [1], null));
		});

		it('should return same state', () => {
			const state = newHistory([], 0, [1], null);
			const result = undoableReducer(state, ActionsCreator.undo());
			expect(result).toEqual(state);
		});
	});

	describe('redo action', () => {
		it('should return the next state', () => {
			const state = newHistory([0], 1, [2], null);
			const result = undoableReducer(state, ActionsCreator.redo());
			expect(result).toEqual(newHistory([0, 1], 2, [], null));
		});

		it('should return same state', () => {
			const state = newHistory([0], 1, [], null);
			const result = undoableReducer(state, ActionsCreator.redo());
			expect(result).toEqual(state);
		});
	});

	describe('clearHistory action', () => {
		it('should return the same state without history', () => {
			const state = newHistory([0], 1, [2], null);
			const result = undoableReducer(state, ActionsCreator.clearHistory());
			expect(result).toEqual(newHistory([], 1, [], null));
		});
	});

	it('should return initialState for initTypes', () => {
		const initialState = newHistory([1, 2], 5, [4, 3], null);
		undoableReducer(initialState, {} as any);

		const state = newHistory([1, 2, 3, 4, 5], 80, [5, 4, 3, 2, 1], null);
		const result = undoableReducer(state, ActionsCreator.init());
		expect(result).toEqual(createHistory(0, null));
	});

	it('should bookmark state', () => {
		const initialState = newHistory([1, 2], 5, [4, 3], null);
		const result = undoableReducer(initialState, ActionsCreator.bookmark<number>(56));
		expect(result).toEqual(createHistory(initialState.present, 56));
	});
});
