import { HistoryState } from '../models';
import { Debug } from './debug';
import { Action, ActionReducer } from '../internal';
import { Actions } from '../actions/actions';

export function createHistory<T>(state: T, bookmark: T | null): HistoryState<T> {
	return newHistory([], state, [], bookmark);
}

export function newHistory<T>(past: T[], present: T, future: T[], bookmark: T | null): HistoryState<T> {
	return {
		past,
		present,
		future,
		bookmark
	};
}

/**
 * check if is a valid history object
 */
export function isHistory(history: any): history is HistoryState<any> {
	return (
		typeof history !== 'undefined' &&
		typeof history.present !== 'undefined' &&
		typeof history.future !== 'undefined' &&
		typeof history.past !== 'undefined' &&
		Array.isArray(history.future) &&
		Array.isArray(history.past)
	);
}

/**
 * Jump to requested index in past history
 */
export function jumpToPast<T>(history: HistoryState<T>, index: number): HistoryState<T> {
	if (index < 0 || index >= history.past.length) {
		return history;
	}

	const { past, present, future } = history;

	const newPast = past.slice(0, index);
	const newFuture = [...past.slice(index + 1), present, ...future];
	const newPresent = past[index];

	return newHistory(newPast, newPresent, newFuture, history.bookmark);
}

/**
 * Jump to requested index in future history
 */
export function jumpToFuture<T>(history: HistoryState<T>, index: number): HistoryState<T> {
	if (index < 0 || index >= history.future.length) {
		return history;
	}

	const { past, present, future } = history;

	const newPast = [...past, present, ...future.slice(0, index)];
	const newPresent = future[index];
	const newFuture = future.slice(index + 1);

	return newHistory(newPast, newPresent, newFuture, history.bookmark);
}

/**
 * Jump n steps in the past or forward
 */
export function jump<T>(history: HistoryState<T>, n: number): HistoryState<T> {
	if (n > 0) {
		return jumpToFuture(history, n - 1);
	}

	if (n < 0) {
		return jumpToPast(history, history.past.length + n);
	}

	return history;
}

export function lengthWithoutFuture<T>(history: HistoryState<T>): number {
	return history.past.length + 1;
}

export function insert<T>(history: HistoryState<T>, newState: T, limit: number | undefined, debug: Debug) {
	debug.log('inserting', newState);
	debug.log('new free: ', limit && limit - lengthWithoutFuture(history));

	const { past, present, bookmark } = history;
	const historyOverflow = limit && lengthWithoutFuture(history) >= limit;

	const pastSliced = past.slice(historyOverflow ? 1 : 0);
	const newPast = [...pastSliced, present];

	return newHistory(newPast, newState, [], bookmark);
}

export function getSkipReducer<T, V extends Action = Action>(
	neverSkipReducer: boolean
): (reducer: ActionReducer<T, V>, res: HistoryState<T>, action: V | Actions<T>) => HistoryState<T> {
	return neverSkipReducer ? (reducer, res, action) => ({ ...res, present: reducer(res.present, action as V) }) : (reducer, res) => res;
}
