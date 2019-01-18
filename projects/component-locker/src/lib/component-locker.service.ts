import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {LockEvent} from './lock-event';

@Injectable({
  providedIn: 'root'
})
export class ComponentLockerService {
  public subject: Subject<LockEvent>;
  private referenceMap;
  public string = '';
  private lockCounterMap: Map<string, number>;

  constructor() {
    this.referenceMap = new Map<string, Array<string>>();
    this.lockCounterMap = new Map<string, number>();
    this.subject = new Subject<LockEvent>();
  }

  public register(name: string, dependingOn: string) {
   // console.log('register before [countmapstate: ', this.lockCounterMap, '] [comp: ' , name , ']', ' [dependson: ' , dependingOn, ']');
    if (this.referenceMap.has(dependingOn)) {
      if (this.referenceMap.get(dependingOn).filter(x => x === name).length === 0) {
        // Parent Component already registered, child component not present
        this.referenceMap.get(dependingOn).push(name);
        this.lockIfParentLocked(dependingOn, name);
      } else {
        // Relation already registered, nothing to do
       // console.log('Chain already there, skipping');
      }
    } else {
      // Parent Component not registered, register both
      this.referenceMap.set(dependingOn, [name]);
      this.lockIfParentLocked(dependingOn, name);
    }

    // Create entry in lockcountermap, if currently not present
    if (!this.lockCounterMap.has(name)) {
      this.lockCounterMap.set(name, 0);
    }

    // Do the same with parent
    if (!this.lockCounterMap.has(dependingOn)) {
      this.lockCounterMap.set(dependingOn, 0);
    }

    // If Relation was already registered and is still locked, relock it
    if (this.lockCounterMap.get(name) > 0) {
      const k = new LockEvent(true, name);
      this.subject.next(k);
    }

    console.log('register after [countmapstate: ', this.lockCounterMap, '] [comp: ' , name , ']', ' [dependson: ' , dependingOn, ']');
  }

  private lockIfParentLocked(dependingOn: string, name: string) {
    if (this.lockCounterMap.get(dependingOn) > 0) {
      this.lock(name);
    }
  }

  public unregister(name: string) {
    // deprecated
  }

  /**
   * Locks the passed component, plus all dependend childs
   * @param componente
   */
  public lock(componente: string) {
    console.log('lock before [countmapstate: ', this.lockCounterMap, '] [comp: ' , componente , ']');
    // TODO compute all the time?
    const list = this.collectChilds(componente);
    // console.log('lockchain ', list);
    list.forEach(x => {
      this.increaseCounter(x);
      const k = new LockEvent(true, x);
      this.subject.next(k);
    });
    console.log('countermap after lock', this.lockCounterMap);
  }

  public unlock(componente: string) {
    // console.warn('unlock ', componente, 'cMap', this.lockCounterMap);
    // TODO compute all the time?
    const list = this.collectChilds(componente);
    list.forEach(x => {
      if (this.decreaseCounter(x) === 0) {
        this.subject.next(new LockEvent(false, x));
      }
    });
    // console.log('coutnermap after unlock cMap:', this.lockCounterMap);
  }

  /**
   * Collects all dependend childs of a component
   * @param component
   */
  public collectChilds(component: string): Array<string> {
    return [component].concat(this.collectDependents(this.referenceMap.get(component)));
  }

  private collectDependents(componentArray: Array<string>): Array<string> {
    if (componentArray === undefined || componentArray.length === 0) {
      return [];
    } else {
      // TODO detect circular dependencies (maybe with dupe check, there shouldnt be dupes in the list)
      return flatMap(component => component, componentArray.map(component => {
        return [component].concat(this.collectDependents(this.referenceMap.get(component)));
      }));
    }
  }

  private increaseCounter(c: string): number {
    // console.log('increase counter for ', c , 'old: ', this.lockCounterMap.get(c));
    let newValue = 1;
    if (this.lockCounterMap.has(c)) {
      newValue = this.lockCounterMap.get(c) + 1;
    }
    this.lockCounterMap.set(c, newValue);
    // console.log('new counter for ', c , 'new: ', this.lockCounterMap.get(c));
    return newValue;
  }

  private decreaseCounter(c: string): number {
    let newValue = 0;
    // console.log('decrease counter for ', c , 'old: ', this.lockCounterMap.get(c));
    if (this.lockCounterMap.has(c)) {
      newValue = this.lockCounterMap.get(c) - 1;
      if (newValue < 0 ) {
        console.warn('Neavtive Counter in referenceMap', c, 'resetting...');
        this.lockCounterMap.set(c, 0);
      } else {
        this.lockCounterMap.set(c, newValue);
      }
    } else {
      console.warn(c, 'not found in referenceMap');
    }
    return newValue;
  }
}

// TODO flatmap problem lösen
const concat = (x, y) =>
  x.concat(y);

const flatMap = (f, xs) =>
  xs.map(f).reduce(concat, []);
