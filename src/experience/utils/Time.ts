import EventEmitter from "./EventEmitter";

export interface TimeInt extends EventEmitter {
  start: number;
  current: number;
  delta: number;
  elapsed: number;
  tick: () => void;
}

export class Time extends EventEmitter implements TimeInt {
  start: number;
  current: number;
  delta: number;
  elapsed: number;
  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.delta = 0;
    this.elapsed = 16;

    window.requestAnimationFrame(() => this.tick());
  }
  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    window.requestAnimationFrame(() => this.tick());

    this.trigger("tick");
  }
}
