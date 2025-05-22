export interface IPoolItemFactory<T> {
    create(): T;
    reset(item: T): void;
}
