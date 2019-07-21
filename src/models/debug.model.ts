export interface DebugDisplayBuffer {
	header: any[];
	prev: any[];
	action: any[];
	next: any[];
	msgs: any[];
}

export enum DebugColors {
	header = '#9575cd',
	prevState = '#9E9E9E',
	action = '#03A9F4',
	nextState = '#4CAF50'
}
