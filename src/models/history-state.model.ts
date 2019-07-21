export interface HistoryState<T> {
	past: T[];
	present: T;
	future: T[];
	bookmark: T | null;
}
