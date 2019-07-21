import { UndoableOptions } from '../models';
import { ActionTypes } from '../actions/actions';

export function applyOptions<T>(options: Partial<UndoableOptions<T>>): UndoableOptions<T> {
	return {
		undoType: options.undoType || ActionTypes.Undo,
		redoType: options.redoType || ActionTypes.Redo,
		bookmarkType: options.bookmarkType || ActionTypes.Bookmark,
		clearHistoryTypes: options.clearHistoryTypes || [ActionTypes.ClearHistory],
		revertToBookmarkTypes: options.revertToBookmarkTypes || [ActionTypes.RevertToBookmark],
		initTypes: options.initTypes || [ActionTypes.Init],
		debug: options.debug || false,
		neverSkipReducer: options.neverSkipReducer || false,
		limit: options.limit,
		filter: options.filter || (() => true)
	};
}

export function isClearHistoryType(actionType: string, clearHistoryTypes: string[]): string | boolean {
	return isInTypes(actionType, clearHistoryTypes);
}

export function isInitType(actionType: string, initTypes: string[]): string | boolean {
	return isInTypes(actionType, initTypes);
}

export function isRevertToBookmarkType(actionType: string, revertToBookmarkTypes: string[]): string | boolean {
	return isInTypes(actionType, revertToBookmarkTypes);
}

function isInTypes(actionType: string, types: string[]): string | boolean {
	return types.indexOf(actionType) > -1 ? actionType : !actionType;
}


