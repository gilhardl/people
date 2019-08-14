import { TestBed, async } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { NxModule, DataPersistence } from '@nrwl/angular';
import { hot } from '@nrwl/angular/testing';

import { RouterEffects } from './router.effects';
import * as RouterActions from './router.actions';

describe('RouterEffects', () => {
  let actions: Observable<any>;
  let effects: RouterEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        RouterEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.get(RouterEffects);
  });

  describe('loadRouter$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: RouterActions.loadRouter() });

      const expected = hot('-a-|', {
        a: RouterActions.loadRouterSuccess({ router: [] })
      });

      expect(effects.loadRouter$).toBeObservable(expected);
    });
  });
});
