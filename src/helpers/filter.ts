import { FilterFunction } from '../models';
import { Action } from '../internal';

/**
 * includeAction helper: whitelist actions to be added to the history
 */
export function includeActions(...actions: string[]): FilterFunction {
	const map = actions.reduce<{ [key: string]: {} }>((acc, action) => {
		acc[action] = {};
		return acc;
	}, {});

	return (action: Action) => !!map[action.type];
}

/**
 * excludeAction helper: blacklist actions from being added to the history
 */
export function excludeActions(...actions: string[]): FilterFunction {
	const map = actions.reduce<{ [key: string]: {} }>((acc, action) => {
		acc[action] = {};
		return acc;
	}, {});

	return (action: Action) => !map[action.type];
}

export function combineFilters<T>(...filters: FilterFunction<T>[]): FilterFunction<T> {
	return filters.reduce(
		(prev, curr) => (action, currentState, previousHistory) =>
			prev(action, currentState, previousHistory) && curr(action, currentState, previousHistory),
		() => true
	);
}