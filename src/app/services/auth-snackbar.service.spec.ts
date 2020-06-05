import { TestBed } from '@angular/core/testing';

import { AuthSnackbarService } from './auth-snackbar.service';

describe('AuthSnackbarService', () => {
  let service: AuthSnackbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
