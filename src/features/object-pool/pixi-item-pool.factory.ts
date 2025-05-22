import { Container } from 'pixi.js';
import { IPoolItemFactory } from './model';
import { TreeNode } from '@shared/view-builder';
import { ServiceContainer } from 'myshengine-core';
import { ViewBuilder } from '@core/view-builder';

export abstract class PixiItemPoolFactory<T extends Container> implements IPoolItemFactory<T> {
    protected config!: TreeNode | null;

    protected createFromConfig(config: TreeNode): T {
        this.config = config;
        const viewBuilder = ServiceContainer.instance.get(ViewBuilder);
        return viewBuilder.create(config) as T;
    }

    public abstract create(): T;

    public abstract reset(item: T): void;
}
