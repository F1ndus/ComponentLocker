import { Injectable } from '@angular/core';
import {TreeElement} from './tree-element';

@Injectable({
  providedIn: 'root'
})
export class ComponentLockerService {

  public root = new TreeElement('root', null);

  constructor() { }

  public register(name: string, dependsOn: string) {
    const res = this.search(dependsOn, this.root.childs);
    res.childs.push(new TreeElement(name, res));
  }

  public unregister(name: string) {
    const parent = this.search(name, this.root.childs).parent;
    parent.childs.forEach((x, i) => {
      if ( x.name === name) { parent.childs.splice(i, 1); }
    });
  }

  private search(name: string, childs: Array<TreeElement>): TreeElement {
    if (name === 'root') {
      return this.root;
    }
    const f = childs.filter(nm => nm.name === name);
    if (f.length > 0) {
      return f[0];
    } else {
      return this.search(name, flatMap((x) => x, childs.map(c => c.childs)));
    }
  }

  lock( compontent: string) {

  }
}

const concat = (x, y) =>
  x.concat(y)

const flatMap = (f, xs) =>
  xs.map(f).reduce(concat, [])
