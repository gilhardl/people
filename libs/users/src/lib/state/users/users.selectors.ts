import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  USERS_FEATURE_KEY,
  UsersState,
  UsersPartialState,
  usersAdapter
} from './users.reducer';

// Lookup the 'Users' feature state managed by NgRx
export const getUsersState = createFeatureSelector<
  UsersPartialState,
  UsersState
>(USERS_FEATURE_KEY);

const { selectAll, selectEntities } = usersAdapter.getSelectors();

export const getUsersLoaded = createSelector(
  getUsersState,
  (state: UsersState) => state.loaded
);

export const getUsersError = createSelector(
  getUsersState,
  (state: UsersState) => state.error
);

export const getAllUsers = createSelector(
  getUsersState,
  (state: UsersState) => selectAll(state)
);

export const getUsersEntities = createSelector(
  getUsersState,
  (state: UsersState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getUsersState,
  (state: UsersState) => state.selectedId
);

export const getSelected = createSelector(
  getUsersEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
