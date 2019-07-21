import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCounter, selectCounterState } from './reducers';
import { Dec, Inc } from './actions/counter.actions';
import { ActionsCreator, HistoryState } from '../../../src';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CounterExample';

  counter$: Observable<number>;
  state$: Observable<HistoryState<number>>;
  canRedo$: Observable<boolean>;
  canUndo$: Observable<boolean>;
  hasBookmark$: Observable<boolean>;

  constructor(private store: Store<any>) {}

  ngOnInit(): void {
    this.counter$ = this.store.pipe(select(selectCounter));
    this.state$ = this.store.pipe(select(selectCounterState));
    this.canRedo$ = this.state$.pipe(map(state => state.future.length > 0));
    this.canUndo$ = this.state$.pipe(map(state => state.past.length > 0));
    this.hasBookmark$ = this.state$.pipe(map(state => !!state.bookmark));
  }

  inc() {
    this.store.dispatch(new Inc());
  }

  dec() {
    this.store.dispatch(new Dec());
  }

  undo() {
    this.store.dispatch(ActionsCreator.undo());
  }

  redo() {
    this.store.dispatch(ActionsCreator.redo());
  }

  bookmark() {
    this.store.dispatch(ActionsCreator.bookmark())
  }

  revertToBookmark() {
    this.store.dispatch(ActionsCreator.revertToBookmark());
  }

  clearHistory() {
    this.store.dispatch(ActionsCreator.clearHistory());
  }

  init() {
    this.store.dispatch(ActionsCreator.init());
  }
}
