import { CounterActions, CounterActionTypes } from '../actions/counter.actions';
import { undoable } from '../../../../src';

export const reducer = undoable<number, CounterActions>(stateReducer, {
	neverSkipReducer: true
});

function stateReducer(state: number = 0, action: CounterActions): number {
	switch (action.type) {
		case CounterActionTypes.Inc:
			return state + 1;

		case CounterActionTypes.Dec:
			return state - 1;

		default:
			return state;
	}
}
