import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LockEvent} from './lock-event';

@Injectable({
  providedIn: 'root'
})
export class ComponentLockerService {
  public subject;
  public map;
  public string = '';
  private lockCounterMap: Map<string, number>;

  constructor() {
    this.map = new Map<string, Array<string>>();
    this.lockCounterMap = new Map<string, number>();
    this.subject = new Subject<LockEvent>();
    console.log('service init');
  }

  public register(name: string, dependingOn: string) {
    console.log('register before');
    if (this.map.has(dependingOn)) {
      if (this.map.get(dependingOn).filter( x => x === name).length === 0) {
        console.log('Chain not found, gonna add');
        this.map.get(dependingOn).push(name);
      } else {
        console.log('Chain already there, skipping');
      }
    } else {
      this.map.set(dependingOn, [name]);
    }
    console.log('countermap', this.lockCounterMap, name);
    if (this.lockCounterMap.get(name) > 0) {
      const k = new LockEvent(true, name);
      this.subject.next(k);
    }
    console.log('register after', this.map, this.string);
  }

  // TODO logic for intersecting dependencies
  public unregister(name: string) {
/*    console.log('unregister', ' name: ', name);
    if (this.lockCounterMap.get(name) === 0) {
      this.map.forEach((v, k) => {
        v.forEach((item, index) => {
          console.log(k, ' -> ', item, index);
          if (item === name) {
            console.log('found item, check if not used');
            if (this.lockCounterMap.get(item) === 0) {
              console.log('not used deleting');
              console.log('before', this.map.get(k));
              this.map.get(k).splice(index, 1);
              console.log('after', this.map.get(k));
            } else {
              console.log('used, leave dependency');
            }
          }
        });
      });
    }*/
  }

  public lock(componente: string) {
    // TODO compute all the time?
    const list = this.collect(componente);
    console.log(list);
    list.forEach(x => {
      this.increaseCounter(x);
      const k = new LockEvent(true, x);
      this.subject.next(k);
    });
  }

  public unlock(componente: string) {
    // TODO compute all the time?
    const list = this.collect(componente);
    list.forEach(x => {
      if (this.decreaseCounter(x) === 0) {
        this.subject.next(new LockEvent(false, x));
      }
    });
  }

  public collect(component: string): Array<string> {
    console.log(this.map.size);
    return [component].concat(this.collectDependents(this.map.get(component)));
  }

  private collectDependents(array: Array<string>): Array<string> {
    if (array === undefined || array.length === 0) {
      return [];
    } else {
      // TODO detect circular dependencies (maybe with dupe check, there shouldnt be dupes in the list)
      return flatMap(x => x, array.map(x => {
        return [x].concat(this.collectDependents(this.map.get(x)));
      }));
    }
  }

  private increaseCounter(c: string): number {
    let newValue = 1;
    if (this.lockCounterMap.has(c)) {
      newValue = this.lockCounterMap.get(c) + 1;
    }
    this.lockCounterMap.set(c, newValue);
    return newValue;
  }

  private decreaseCounter(c: string): number {
    const newValue = this.lockCounterMap.get(c) - 1;
    if (newValue < 0 ) { throw new Error('Negative Counter in Map'); }
    this.lockCounterMap.set(c, newValue);
    return newValue;
  }
}

// TODO flatmap problem lösen
const concat = (x, y) =>
  x.concat(y);

const flatMap = (f, xs) =>
  xs.map(f).reduce(concat, []);
