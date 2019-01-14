import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentLockerService {

  map = new Map<String, Array<String>>();

  constructor() { }

  lock( compontent: string) {
    const hasDependends = this.map.get(compontent) !== undefined;
  }
}
