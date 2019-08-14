import { RouterEntity } from './router.models';
import * as RouterActions from './router.actions';
import { RouterState, initialState, reducer } from './router.reducer';

describe('Router Reducer', () => {
  const createRouterEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as RouterEntity);

  beforeEach(() => {});

  describe('valid Router actions', () => {
    it('loadRouterSuccess should return set the list of known Router', () => {
      const router = [
        createRouterEntity('PRODUCT-AAA'),
        createRouterEntity('PRODUCT-zzz')
      ];
      const action = RouterActions.loadRouterSuccess({ router });

      const result: RouterState = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
