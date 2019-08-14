import { createAction, props } from '@ngrx/store';
import { RouterEntity } from './router.models';

export const loadRouter = createAction('[Router] Load Router');

export const loadRouterSuccess = createAction(
  '[Router] Load Router Success',
  props<{ router: RouterEntity[] }>()
);

export const loadRouterFailure = createAction(
  '[Router] Load Router Failure',
  props<{ error: any }>()
);
