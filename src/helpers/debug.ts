import { DebugColors, DebugDisplayBuffer, HistoryState } from '../models';
import { Action } from '../internal';

export class Debug {
	private displayBuffer!: DebugDisplayBuffer;

	constructor(private readonly enabled: boolean) {}

	private initBuffer() {
		this.displayBuffer = {
			header: [],
			prev: [],
			action: [],
			next: [],
			msgs: []
		};
	}

	private printBuffer() {
		const { header, prev, next, action, msgs } = this.displayBuffer;

		if (console.group) {
			console.groupCollapsed(...header);
			console.log(...prev);
			console.log(...action);
			console.log(...next);
			console.log(...msgs);
			console.groupEnd();
		} else {
			console.log(...header);
			console.log(...prev);
			console.log(...action);
			console.log(...next);
			console.log(...msgs);
		}
	}

	private colorFormat(text: string, color: DebugColors, obj: any): any[] {
		return [`%c${text}`, `color: ${color}; font-weight: bold`, obj];
	}

	start<T>(action: Action, state: HistoryState<T>) {
		this.initBuffer();
		if (this.enabled) {
			if (console.group) {
				this.displayBuffer.header = [
					'%c[ ngrx-undo-reducer ]',
					`font-style: italic; color: ${DebugColors.header};`,
					'action',
					action.type
				];
				this.displayBuffer.action = this.colorFormat('action', DebugColors.action, action);
				this.displayBuffer.prev = this.colorFormat('prev history', DebugColors.prevState, state);
			} else {
				this.displayBuffer.header = ['[ ngrx-undo-reducer ]', 'action', action.type];
				this.displayBuffer.action = ['action', action];
				this.displayBuffer.prev = ['prev history', state];
			}
		}
	}

	end<T>(nextState: HistoryState<T>, result?: string) {
		if (this.enabled) {
			if (console.group) {
				this.displayBuffer.next = this.colorFormat('next history', DebugColors.nextState, nextState);
			} else {
				this.displayBuffer.next = ['next history', nextState];
			}

			if (result) {
				this.displayBuffer.header[0] += `-[ ${result} ]`;
			}

			this.printBuffer();
		}
	}

	log(...args: any[]) {
		if (this.enabled) {
			this.displayBuffer.msgs = this.displayBuffer.msgs.concat([...args, '\n']);
		}
	}
}
