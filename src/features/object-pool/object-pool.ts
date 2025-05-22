import { IPoolItemFactory } from './model';

export class ObjectPool<T> {
    public get size() {
        return this._size;
    }

    public get currentSize() {
        return this._pool.length;
    }

    private _pool: T[] = [];

    constructor(
        private _factory: IPoolItemFactory<T>,
        private _size: number,
        private _dynamic?: boolean,
    ) {
        this.intitialize();
    }

    private intitialize(): void {
        for (let i = 0; i < this._size; ++i) {
            const item = this._factory.create();
            this._pool.push(item);
        }
    }

    public get(): T | undefined {
        if (!this._pool.length && !this._dynamic) {
            throw new Error('No more items in pool');
        }

        let item;

        if (this._pool.length) {
            item = this._pool.pop();
        }

        if (!item && this._dynamic) {
            item = this._factory.create();
        }

        return item;
    }

    public release(item: T): void {
        this._factory.reset(item);
        this._pool.push(item);
    }
}
