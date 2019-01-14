import { TestBed } from '@angular/core/testing';

import { ComponentLockerService } from './component-locker.service';

fdescribe('ComponentLockerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    expect(service).toBeTruthy();
  });

  /**
   *        * ROOT
   *       /
   *  test*
   */
  it('should add something to the tree', () => {
    console.log('dd');
    const service = TestBed.get(ComponentLockerService);
    service.register('test', 'root');
    expect(service.root.childs.length).toBe(1);
  });

  /**
   *        * ROOT
   *       /
   *  test*
   *      |
   *      *test2
   */
  it('should should add meem', () => {
    console.log('dd');
    const service = TestBed.get(ComponentLockerService);
    service.register('test', 'root');
    service.register('test2', 'test');
    expect(service.root.childs[0].childs[0].name).toBe('test2');
  });

  /**
   *        * ROOT
   *       /
   *  test*
   *      |
   *      *test2
   *      |
   *      * test3
   */
  it('should should add meem', () => {
    console.log('dd');
    const service = TestBed.get(ComponentLockerService);
    service.register('test', 'root');
    service.register('test2', 'test');
    service.register('test3', 'test2');
    console.log(service.root.childs);
    expect(service.root.childs[0].childs[0].childs[0].name).toBe('test3');
  });

  /**
   *        * ROOT
   *       / \
   *  test*   *test2
   */
  it('should should add meem', () => {
    console.log('dd');
    const service = TestBed.get(ComponentLockerService);
    service.register('test', 'root');
    service.register('test2', 'root');
    expect(service.root.childs.length).toBe(2);
  });
});
