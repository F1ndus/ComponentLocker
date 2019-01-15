import {TestBed} from '@angular/core/testing';

import {ComponentLockerService} from './component-locker.service';

describe('ComponentLockerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    expect(service).toBeTruthy();
  });

  it('should hold new element', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    expect(service.map.size).toBe(1);
    expect(service.map.get('firstelement')[0]).toEqual('test');
  });

  it('should hold two elements, not overriding the old value', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'firstelement');
    expect(service.map.size).toBe(1);
    expect(service.map.get('firstelement').length).toEqual(2);
  });

  it('should create 2 entries in the map', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'secondelement');
    expect(service.map.size).toBe(2);
    expect(service.map.get('firstelement').length).toEqual(1);
    expect(service.map.get('secondelement').length).toEqual(1);
  });

  it('should remove entry from the map', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'firstelement');
    expect(service.map.size).toBe(1);
    expect(service.map.get('firstelement').length).toEqual(2);
    service.unregister('test');
    expect(service.map.size).toBe(1);
    expect(service.map.get('firstelement').length).toEqual(1);
    expect(service.map.get('firstelement')[0]).toEqual('test2');
  });

  it('should remove entry from the map 2', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'firstelement');
    service.register('test3', 'firstelement');
    service.register('test4', 'firstelement');
    service.register('test5', 'firstelement');
    expect(service.map.size).toBe(1);
    expect(service.map.get('firstelement').length).toEqual(5);
    service.unregister('test');
    expect(service.map.size).toBe(1);
    expect(service.map.get('firstelement').length).toEqual(4);
  });

  /**
   *  firstelement <-lock
   *               <-test2
   */

  it('should return 3 item array', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'firstelement');
    service.register('test2', 'firstelement');
    const items = service.collect('firstelement');
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
    const items = service.collect('firstelement');
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
    const items = service.collect('firstelement');
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
    const items = service.collect('firstelement');
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

  it('should remove entry', () => {
    const service: ComponentLockerService = TestBed.get(ComponentLockerService);
    service.register('test', 'root');
    expect(service.map.size).toBe(1);
    service.unregister('test');
    expect(service.map.get('root').length).toEqual(0);
  });
});
