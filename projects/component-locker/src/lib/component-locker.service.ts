import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentLockerService {

  public map = new Map<string, Array<string>>();

  constructor() { }

  public register(name: string, dependingOn: string) {
    if (this.map.has(dependingOn)) {
      this.map.get(dependingOn).push(name);
    } else {
      this.map.set(dependingOn, [name]);
    }
  }

  public unregister(name: string) {
    this.map.forEach( (v, k) => {
      console.log(k);
      this.map.get(k).forEach( (item, index) => {
        if ( item === name) { this.map.get(k).splice(index, 1); }
      });
    });
  }

  public lock( component: string): Array<string> {
    return [component].concat(this.collectDependends(this.map.get(component)));
  }

  private collectDependends(array: Array<string>): Array<string> {
    if (array === undefined || array.length === 0 ) {
      return [];
    } else {
      return flatMap(x => x, array.map(x => {
        return [x].concat(this.collectDependends(this.map.get(x)));
      }));
    }
  }
}

const concat = (x, y) =>
  x.concat(y)

const flatMap = (f, xs) =>
  xs.map(f).reduce(concat, [])
