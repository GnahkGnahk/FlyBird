// ObjectPool.ts
export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;

  constructor(factory: () => T, private maxSize: number = 5) {
    this.factory = factory;
  }

  /** Get Object */
  get(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.factory();
  }

  /** Return Object */
  release(obj: T) {
    if (this.pool.length < this.maxSize) {
      this.pool.push(obj);
    }
  }

  /** Clear pool */
  clear() {
    this.pool.length = 0;
  }

  count(): number {
    return this.pool.length;
  }
}
