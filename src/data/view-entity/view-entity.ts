import { Container } from 'pixi.js';
import { ComponentFilter, ComponentType, Component, IEntity } from 'myshengine-core';
import { IViewEntity } from '@shared/view-entity';

export class ViewEntity implements IViewEntity {
    private _list: Map<Container, IEntity> = new Map();

    public add(view: Container, entity: IEntity): void {
        this._list.set(view, entity);
    }

    public get(view: Container): IEntity | null {
        return this._list.get(view) || null;
    }

    public getInChildren(view: Container): IEntity[] {
        const entities: IEntity[] = [];

        for (let i = 0; i < view.children.length; i++) {
            const child = view.children[i];
            const entity = this.get(child as Container);
            if (entity) entities.push(entity);

            const findMore = this.getInChildren(child as Container);

            entities.push(...findMore);
        }

        return entities;
    }

    public getInChildrenByFilter(view: Container, filter: ComponentFilter): IEntity[] {
        const finded: IEntity[] = [];
        const entities = this.getInChildren(view);

        entities.forEach((entity) => {
            if (entity.isSatisfiedFilter(filter)) {
                finded.push(entity);
            }
        });

        return finded;
    }

    public getComponent<T extends Component>(view: Container, type: ComponentType<T>): T {
        const entity = this.get(view);
        if (!entity) throw new Error(`Entity not found for view: ${view.name}`);

        return entity.getComponent<T>(type);
    }
}
