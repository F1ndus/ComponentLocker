import {TestBed} from '@angular/core/testing';

import {ComponentLockerService} from './component-locker.service';

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

  it('should hold new element', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    expect(service['referenceMap'].size).toBe(1);
    expect(service['referenceMap'].get('firstelement')[0]).toEqual('test');
  });

  it('should hold two elements, not overriding the old value', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'firstelement');
    expect(service['referenceMap'].size).toBe(1);
    expect(service['referenceMap'].get('firstelement').length).toEqual(2);
  });

  it('should create 2 entries in the referenceMap', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'secondelement');
    expect(service['referenceMap'].size).toBe(2);
    expect(service['referenceMap'].get('firstelement').length).toEqual(1);
    expect(service['referenceMap'].get('secondelement').length).toEqual(1);
  });

  it('should keep the removed component in referenceMap', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'firstelement');
    expect(service['referenceMap'].size).toBe(1);
    expect(service['referenceMap'].get('firstelement').length).toEqual(2);
    service.unregister('test');
    expect(service['referenceMap'].size).toBe(1);
    expect(service['referenceMap'].get('firstelement').length).toEqual(2);
    expect(service['referenceMap'].get('firstelement')[0]).toEqual('test');
    expect(service['referenceMap'].get('firstelement')[1]).toEqual('test2');
  });

  it('should lock itself and all dependends', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'test');
    service.lock('firstelement');
    expect(service['lockCounterMap'].get('firstelement')).toBe(1);
    expect(service['lockCounterMap'].get('test')).toBe(1);
    expect(service['lockCounterMap'].get('test2')).toBe(1);
  });

  it('should maintain state in countmap after removing', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'test');
    service.lock('firstelement');
    service.unregister('firstelement');
    expect(service['lockCounterMap'].get('firstelement')).toBe(1);
    expect(service['lockCounterMap'].get('test')).toBe(1);
    expect(service['lockCounterMap'].get('test2')).toBe(1);
  });

  it('should maintain state in countmap after removing and adding again', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'test');
    service.lock('firstelement');
    service.unregister('firstelement');
    service.register('test', 'firstelement');
    expect(service['lockCounterMap'].get('firstelement')).toBe(1);
    expect(service['lockCounterMap'].get('test')).toBe(1);
    expect(service['lockCounterMap'].get('test2')).toBe(1);
  });

  it('new component should check parents lock state and should lock if needed', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.lock('firstelement');
    service.register('test2', 'test');
    expect(service['lockCounterMap'].get('firstelement')).toBe(1);
    expect(service['lockCounterMap'].get('test')).toBe(1);
    expect(service['lockCounterMap'].get('test2')).toBe(1);
  });

  it('new component should check parents lock state and should lock if needed, components child should lock aswell', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test3', 'test2');
    service.lock('firstelement');
    service.register('test2', 'test');
    expect(service['lockCounterMap'].get('test3')).toBe(1);
  });

  /**
   *  firstelement <-lock
   *               <-test2
   */

  it('should return 3 item array', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'firstelement');
    const items = service.collectChilds('firstelement');
    console.log(items);
    expect(items.length).toBe(3);
  });

  /**
   *  firstelement<-lock<-test2
   */

  it('should return 3 item array', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'test');
    const items = service.collectChilds('firstelement');
    console.log(items);
    expect(items.length).toBe(3);
  });

  /**
   *  firstelement<-lock<-test2
   *  secondelement<-test3
   */
  it('should return 3 item array, ignoring the not connected component', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'test');
    service.register('test3', 'secondelement');
    const items = service.collectChilds('firstelement');
    console.log(items);
    expect(items.length).toBe(3);
  });

  /**
   *  firstelement<-lock<-test2--|
   *                 /\          |
   *                  |__________|
   */
/*  it('should detect circual dependency', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('lock', 'firstelement');
    service.register('test2', 'lock');
    service.register('lock', 'test2');
    const items = service.collectChilds('firstelement');
    console.log(items);
    expect(items.length).toBe(2);
  });*/

  it('should get 2 events', (done) => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    let number = 0;
    service.subject.subscribe(x => {
      if (x.componentName === 'test' || x.componentName === 'firstelement') { number++; }
      if (number === 2) {
        console.log('done');
        done();
      }
    });
    service.lock('firstelement');
  });

/*  it('should remove entry', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'root');
    expect(service.['referenceMap'].size).toBe(1);
    service.unregister('test');
    expect(service.['referenceMap'].get('root').length).toEqual(0);
  });*/
});
