import { RouterEntity } from './router.models';
import { RouterState, routerAdapter, initialState } from './router.reducer';
import * as RouterSelectors from './router.selectors';

describe('Router Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getRouterId = it => it['id'];
  const createRouterEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as RouterEntity);

  let state;

  beforeEach(() => {
    state = {
      router: routerAdapter.addAll(
        [
          createRouterEntity('PRODUCT-AAA'),
          createRouterEntity('PRODUCT-BBB'),
          createRouterEntity('PRODUCT-CCC')
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true
        }
      )
    };
  });

  describe('Router Selectors', () => {
    it('getAllRouter() should return the list of Router', () => {
      const results = RouterSelectors.getAllRouter(state);
      const selId = getRouterId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = RouterSelectors.getSelected(state);
      const selId = getRouterId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getRouterLoaded() should return the current 'loaded' status", () => {
      const result = RouterSelectors.getRouterLoaded(state);

      expect(result).toBe(true);
    });

    it("getRouterError() should return the current 'error' state", () => {
      const result = RouterSelectors.getRouterError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
