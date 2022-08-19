/*
 * @Descripttion:
 * @version:
 * @Author: xiaziheng
 * @Date: 2022-04-20 14:25:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-26 17:28:57
 */
import { Observable } from "rxjs";

export class Emiter {
  constructor() {
    this.observers = new Map();
  }

  addObserver(topic, fn) {
    if (!this.observers.has(topic)) {
      this.observers.set(topic, []);
    }
    this.observers.get(topic)?.push(fn);
  }
  removeObserver(topic, observer) {
    const list = this.observers[topic];
    if (list && list.length > 0) {
      this.observers[topic] = list.filter((x) => x !== observer);
    }
  }
  on(topic) {
    return new Observable((observer) => {
      const addedObservers = [];
      if (Array.isArray(topic)) {
        topic.forEach((t) => {
          this.addObserver(t, observer);
          addedObservers.push([t, observer]);
        });
      } else {
        this.addObserver(topic, observer);
        addedObservers.push([topic, observer]);
      }
      return {
        unsubscribe: () => {
          addedObservers.forEach((x) => this.removeObserver(x[0], x[1]));
        },
      };
    });
  }

  emit(topic, data) {
    this.observers.get(topic)?.forEach((observer) => {
      observer.next(data);
    });
  }
}
