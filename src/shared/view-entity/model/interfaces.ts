import { Component, ComponentFilter, ComponentType, IEntity } from 'myshengine-core';
import { Container } from 'pixi.js';

export interface IViewEntity {
    add(view: Container, entity: IEntity): void;
    get(view: Container): IEntity | null;
    getInChildren(view: Container): IEntity[];
    getInChildrenByFilter(view: Container, filter: ComponentFilter): IEntity[];
    getComponent<T extends Component>(view: Container, type: ComponentType<T>): T;
}
