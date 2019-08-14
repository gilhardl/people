import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromRouter from '@ngrx/router-store';

import { ROUTER_FEATURE_KEY } from './state/router/router.reducer';
import { RouterFacade } from './state/router/router.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ROUTER_FEATURE_KEY, fromRouter.routerReducer),
    EffectsModule.forFeature([])
  ],
  providers: [RouterFacade]
})
export class RouterModule {}
