import { Action } from '@ngrx/store';

export enum CounterActionTypes {
  Inc = 'inc',
  Dec = 'dec'
}

export class Inc implements Action {
  readonly type = CounterActionTypes.Inc;
}

export class Dec implements Action {
  readonly type = CounterActionTypes.Dec;
}

export type CounterActions = Inc | Dec;
