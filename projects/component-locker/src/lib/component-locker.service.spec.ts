import { TestBed } from '@angular/core/testing';

import { ComponentLockerService } from './component-locker.service';

describe('ComponentLockerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    expect(service).toBeTruthy();
  });
});
