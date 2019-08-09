import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as UsersActions from './users.actions';
import { UsersEntity } from './users.models';

export const USERS_FEATURE_KEY = 'users';

export interface UsersState extends EntityState<UsersEntity> {
  selectedId?: string | number; // which Users record has been selected
  loaded: boolean; // has the Users list been loaded
  error?: string | null; // last none error (if any)
}

export interface UsersPartialState {
  readonly [USERS_FEATURE_KEY]: UsersState;
}

export const usersAdapter: EntityAdapter<UsersEntity> = createEntityAdapter<
  UsersEntity
>();

export const initialState: UsersState = usersAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadUsers, state => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.addAll(users, { ...state, loaded: true })
  ),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
