export class LockEvent {

  constructor(locked: boolean, componentName: string) {
    this.locked = locked;
    this.componentName = componentName;
  }


  locked: boolean;
  componentName: string;
}
