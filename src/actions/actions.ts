import { Action } from '../internal';

export enum ActionTypes {
	Init = '@@ngrx-undo-reducer/Init',
	Undo = '@@ngrx-undo-reducer/Undo',
	Redo = '@@ngrx-undo-reducer/Redo',
	ClearHistory = '@@ngrx-undo-reducer/ClearHistory',
	Bookmark = '@@ngrx-undo-reducer/Bookmark',
	RevertToBookmark = '@@ngrx-undo-reducer/RevertToBookmark'
}

class Init implements Action {
	readonly type = ActionTypes.Init;
}

class Undo implements Action {
	readonly type = ActionTypes.Undo;
}

class Redo implements Action {
	readonly type = ActionTypes.Redo;
}

class ClearHistory implements Action {
	readonly type = ActionTypes.ClearHistory;
}

export class Bookmark<T> implements Action {
	readonly type = ActionTypes.Bookmark;

	constructor(public payload?: T) {}
}

class RevertToBookmark implements Action {
	readonly type = ActionTypes.RevertToBookmark;
}

export type Actions<T> = Init | Undo | Redo | ClearHistory | Bookmark<T> | RevertToBookmark;

export class ActionsCreator {
	private constructor() {}

	static init(): Init {
		return new Init();
	}

	static undo(): Undo {
		return new Undo();
	}

	static redo(): Redo {
		return new Redo();
	}

	static clearHistory(): ClearHistory {
		return new ClearHistory();
	}

	static bookmark<T>(payload?: T): Bookmark<T> {
		return new Bookmark(payload);
	}

	static revertToBookmark(): RevertToBookmark {
		return new RevertToBookmark();
	}
}
