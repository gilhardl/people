import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/angular/testing';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';

import { NxModule } from '@nrwl/angular';

import { RouterEntity } from './router.models';
import { RouterEffects } from './router.effects';
import { RouterFacade } from './router.facade';

import * as RouterSelectors from './router.selectors';
import * as RouterActions from './router.actions';
import {
  ROUTER_FEATURE_KEY,
  RouterState,
  initialState,
  reducer
} from './router.reducer';

interface TestSchema {
  router: RouterState;
}

describe('RouterFacade', () => {
  let facade: RouterFacade;
  let store: Store<TestSchema>;
  const createRouterEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`
    } as RouterEntity);

  beforeEach(() => {});

  describe('used in NgModule', () => {
    beforeEach(() => {
      @NgModule({
        imports: [
          StoreModule.forFeature(ROUTER_FEATURE_KEY, reducer),
          EffectsModule.forFeature([RouterEffects])
        ],
        providers: [RouterFacade]
      })
      class CustomFeatureModule {}

      @NgModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          CustomFeatureModule
        ]
      })
      class RootModule {}
      TestBed.configureTestingModule({ imports: [RootModule] });

      store = TestBed.get(Store);
      facade = TestBed.get(RouterFacade);
    });

    /**
     * The initially generated facade::loadAll() returns empty array
     */
    it('loadAll() should return empty list with loaded == true', async done => {
      try {
        let list = await readFirst(facade.allRouter$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        facade.loadAll();

        list = await readFirst(facade.allRouter$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Use `loadRouterSuccess` to manually update list
     */
    it('allRouter$ should return the loaded list; and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.allRouter$);
        let isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(0);
        expect(isLoaded).toBe(false);

        store.dispatch(
          RouterActions.loadRouterSuccess({
            router: [createRouterEntity('AAA'), createRouterEntity('BBB')]
          })
        );

        list = await readFirst(facade.allRouter$);
        isLoaded = await readFirst(facade.loaded$);

        expect(list.length).toBe(2);
        expect(isLoaded).toBe(true);

        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
