import { ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { HistoryState } from '../../../../src/models';
import * as fromCounter from './counter.reducer';
import { InjectionToken } from '@angular/core';

export interface State {
	counter: HistoryState<number>;
}

export const reducersToken = new InjectionToken<ActionReducerMap<State>>('MyState Reducers', {
	factory: () => reducers
});

const reducers: ActionReducerMap<State> = {
	counter: fromCounter.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectCounterState = createFeatureSelector<HistoryState<number>>('counter');
export const selectCounter = createSelector(selectCounterState, state => state.present);

