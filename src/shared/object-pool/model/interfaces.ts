import { IPoolItemFactory, ObjectPool } from '@features/object-pool';

export interface IPoolsController {
    create<T>(
        name: string,
        factory: new () => IPoolItemFactory<T>,
        size: number,
        dynamic?: boolean,
    ): ObjectPool<T>;
    get<T>(name: string): ObjectPool<T>;
}
