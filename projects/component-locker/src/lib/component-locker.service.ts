import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {LockEvent} from './lock-event';

@Injectable({
  providedIn: 'root'
})
export class ComponentLockerService {
  public subject;
  public map;
  public string = '';

  constructor() {
    this.map =  new Map<string, Array<string>>();
    this.subject = new Subject<LockEvent>();
    console.log('service init');
  }

  public register(name: string, dependingOn: string) {
    console.log('register before', this.map.size);
    if (this.map.has(dependingOn)) {
      this.map.get(dependingOn).push(name);
    } else {
      this.map.set(dependingOn, [name]);
    }
    this.string = '?????';
    console.log('register after', this.map, this.string);
  }

  // TODO logic for intersecting dependencies
  public unregister(name: string) {
    console.log('unregister', ' name: ', name);
    this.map.forEach( (v, k) => {
      this.map.get(k).forEach( (item, index) => {
        console.log(k, ' -> ', item, index);
        if (item === name) {
          console.log('found item');
          console.log('before', this.map.get(k));
          this.map.get(k).splice(index, 1);
          console.log('after', this.map.get(k));
        }
      });
    });
  }

  public lock(componente: string) {
    // TODO compute all the time?
    const list = this.collect(componente);
    console.log(list);
    list.forEach(x => {
      const k = new LockEvent(true, x);
      this.subject.next(k);
    });
  }

  public unlock(componente: string) {
    // TODO compute all the time?
    const list = this.collect(componente);
    list.forEach(x => this.subject.next(new LockEvent(false, x)));
  }

  public collect(component: string): Array<string> {
    console.log(this.map.size);
    return [component].concat(this.collectDependents(this.map.get(component)));
  }

  private collectDependents(array: Array<string>): Array<string> {
    if (array === undefined || array.length === 0 ) {
      return [];
    } else {
      // TODO detect circular dependencies (maybe with dupe check, there shouldnt be dupes in the list)
      return flatMap(x => x, array.map(x => {
        return [x].concat(this.collectDependents(this.map.get(x)));
      }));
    }
  }
}
// TODO flatmap problem lösen
const concat = (x, y) =>
  x.concat(y)

const flatMap = (f, xs) =>
  xs.map(f).reduce(concat, [])
