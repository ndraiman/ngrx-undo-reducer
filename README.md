# ngrx-undo-reducer

[![npm](https://img.shields.io/npm/v/ngrx-undo-reducer.svg)](https://www.npmjs.com/package/ngrx-undo-reducer)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/Nexxado/ngrx-undo-reducer/master/LICENSE.md)

**Heavily** inspired by [redux-undo](https://github.com/omnidan/redux-undo)

See [Demo](https://ngrx-undo-reducer-demo.stackblitz.io)

## Installation

```bash
# NPM
npm install ngrx-undo-reducer

# Yarn
yarn add ngrx-undo-reducer
```

## API

#### AOT Builds (--prod)

Need to use `InjectionToken` to support AOT builds due to Function call of `undoable()`.

Without it, angular-cli will throw the following error: `Function calls are not supported in decorators but 'undoable' was called.`

```js
import { undoable } from 'ngrx-undo-reducer';

const config: UndoableOptions<MyState> = { ... }
const reducers: ActionReducerMap<MyState> = {
	stateProp: undoable(fromStateProp.reducer, config),
};
export const reducersToken = new InjectionToken<ActionReducerMap<MyState>>(
	'MyState Reducers', 
	{ factory: () => reducers }
);
```

```js
@NgModule({
	imports: [
		StoreModule.forRoot(reducersToken)
		// ...
	]
	// ...
})
export class MyModule {}
```

#### For non-AOT builds

You can import reducers as you normally would.

```js
import { undoable } from 'ngrx-undo-reducer';

const config: UndoableOptions<MyState> = { ... }
export const reducers: ActionReducerMap<MyState> = {
	stateProp: undoable(fromStateProp.reducer, config),
};
```

```js
@NgModule({
	imports: [
		StoreModule.forRoot(reducers)
		// ...
	]
	// ...
})
export class MyModule {}
```

## History API

Wrapping your reducer with undoable makes the state look like this:

```js
{
    past: [...pastStatesHere...],
    present: {...currentStateHere...},
    future: [...futureStatesHere...],
    bookmark: {...bookmarkedStateHere...}
}
```

## Configuration

A configuration object can be passed to `undoable()` like this (values shown
are default values):

```js
undoable(reducer, {
	limit: undefined, // set to a number to turn on a limit for the history
	filter: () => true, // see `Filtering Actions`
	undoType: ActionTypes.Undo, // define a custom action type for this undo action
	redoType: ActionTypes.Redo, // define a custom action type for this redo action
	clearHistoryTypes: [ActionTypes.ClearHistory], // define several action types that would clear the history
	bookmarkType: ActionTypes.Bookmark, // define action type that would bookmark the state passed via action.payload or will take state.present if no payload was passed.
	revertToBookmarkTypes: [ActionTypes.RevertToBookmark], // define action types that would revert state to the bookmarked state
	initTypes: [ActionTypes.Init], // will revert to initialState
	debug: false, // set to `true` to turn on debugging
	neverSkipReducer: false // prevent undoable from skipping the reducer on undo/redo and clearHistoryType actions
});
```

## Filtering Actions

If you don't want to include every action in the undo/redo history, you can add
a `filter` function to `undoable`. This is useful for, for example, excluding
actions that were not triggered by the user.

`ngrx-undo-reducer` provides you with the `includeActions` and `excludeActions` helpers
for basic filtering. They should be imported like this:

```js
import { undoable, includeActions, excludeActions } from 'ngrx-undo-reducer';

// Single Action
undoable(reducer, { filter: includeActions(SOME_ACTION) });
undoable(reducer, { filter: excludeActions(SOME_ACTION) });

// Multiple Actions
undoable(reducer, { filter: includeActions(SOME_ACTION, SOME_OTHER_ACTION) });
undoable(reducer, { filter: excludeActions(SOME_ACTION, SOME_OTHER_ACTION) });
```

#### Custom Filters

If you want to create your own filter, pass in a function with the signature
`(action, currentState, previousHistory)`. For example:

```js
undoable(reducer, {
	filter: function filterActions(action, currentState, previousHistory) {
		return action.type === SOME_ACTION; // only add to history if action is SOME_ACTION
	}
});

// The entire `history` state is available to your filter, so you can make
// decisions based on past or future states:

undoable(reducer, {
	filter: function filterState(action, currentState, previousHistory) {
		let { past, present, future } = previousHistory;
		return future.length === 0; // only add to history if future is empty
	}
});
```

#### Combining Filters

You can also use our helper to combine filters.

```js
import { undoable, combineFilters } from 'ngrx-undo-reducer';

function isActionSelfExcluded(action) {
	return action.wouldLikeToBeInHistory;
}

function areWeRecording(action, state) {
	return state.recording;
}

undoable(reducer, {
	filter: combineFilters(isActionSelfExcluded, areWeRecording)
});
```
