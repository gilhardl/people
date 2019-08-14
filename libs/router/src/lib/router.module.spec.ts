import { async, TestBed } from '@angular/core/testing';
import { RouterModule } from './router.module';

describe('RouterModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(RouterModule).toBeDefined();
  });
});
