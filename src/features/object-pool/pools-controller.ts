import { IPoolsController } from '@shared/object-pool';
import { IPoolItemFactory } from './model';
import { ObjectPool } from './object-pool';

export class PoolsController implements IPoolsController {
    private _pools: Map<string, ObjectPool<any>> = new Map();

    public create<T>(
        name: string,
        factory: new () => IPoolItemFactory<T>,
        size: number,
        dynamic?: boolean,
    ): ObjectPool<T> {
        const factoryInstance = new factory();
        const pool = new ObjectPool(factoryInstance, size, dynamic);
        this._pools.set(name, pool);

        return pool;
    }

    public get<T>(name: string): ObjectPool<T> {
        let pool = this._pools.get(name);
        if (!pool) throw Error(`No pool with name ${name} found`);
        return pool;
    }
}
