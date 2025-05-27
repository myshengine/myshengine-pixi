import { Component, EntityStorage, IEntity, ServiceContainer, Utils } from 'myshengine-core';
import { Application, Container, Graphics } from 'pixi.js';
import { PixiEntity } from '@data/entity';
import {
    IBuilderBehaviour,
    IDisplayObjectOptions,
    IEntityOptions,
    IMaskOptions,
    IVec2,
    WithAnchor,
} from '@shared/view-builder';
import { Layers } from '@core/layers';
import { ViewEntity } from '@data/view-entity';


export abstract class AbstractBuilderBehaviour<T extends IDisplayObjectOptions> implements IBuilderBehaviour<T> {

    public abstract create(options: T): Container;

    protected setCommonData(options: IDisplayObjectOptions, view: Container): void {
        view.name = options.name;
        view.alpha = options.alpha === undefined ? 1 : options.alpha;
        view.rotation = options.rotation || 0;
        view.zIndex = options.zIndex || 0;
        view.zOrder = options.zOrder || 0;
        view.visible = options.visible !== undefined ? options.visible : true;
        view.sortableChildren = !!options.sortableChildren;

        if (options.position) view.position = { x: options.position.x || 0, y: options.position.y || 0 };
        if (options.relativePosition) this.setRelativePosition(options.relativePosition, view);
        if (options.scale) view.scale = { x: options.scale.x || 1, y: options.scale.y || 1 };
        if (options.pivot) view.pivot = { x: options.pivot.x || 0, y: options.pivot.y || 0 };

        if (options.width) view.width = options.width;
        if (options.height) view.height = options.height;
        if (options.hitArea) view.hitArea = options.hitArea;

        if (options.parentGroup) {
            const layers = ServiceContainer.instance.get(Layers);
            view.parentGroup = layers.getGroup(options.parentGroup);
        }

        options.entity && this.setEntity(options.entity, view);
        options.mask && this.setMask(options.mask, view);

        if (options.interactive) {
            view.eventMode = options.interactive.eventMode;
            view.cursor = options.interactive.cursor;

            options.interactive.events.forEach(({ evnetType, callback }) => {
                view.on(evnetType, callback);
            });
        }

        if (options.interactiveChildren !== undefined) {
            view.interactiveChildren = options.interactiveChildren;
        }

        if(options.debugBorder) { 
            const color = options.debugBorderColor || 0xff0000;
            const width = options.debugBorderWidth || 1;
            this.setDebugBorder(view, width, color); 
        }
    }

    protected setAnchor(anchorDefault: IVec2 | undefined, view: WithAnchor<Container>): void {
        const defaultPoint = 0.5;
        const anchor = anchorDefault || { x: defaultPoint, y: defaultPoint };

        const x = anchor.x === undefined ? defaultPoint : anchor.x;
        const y = anchor.y === undefined ? defaultPoint : anchor.y;

        view.anchor.set(x, y);
    }

    protected setRelativePosition(relativePosition: IVec2, view: Container): void {
        const pixi = ServiceContainer.instance.get(Application)
        const { width, height } = pixi.renderer.screen;

        const x = relativePosition.x || 0;
        const y = relativePosition.y || 0;
        const relativeX = (width / 2) * x;
        const relativeY = (height / 2) * y;

        view.position.set(relativeX, relativeY);
    }

    protected setMask(mask: IMaskOptions, view: Container): void {
        const { x, y, type } = mask;
        const container = new Graphics();
        container.beginFill(mask.color || 0xffffff);

        if(type === 'rect') {
            let { width, height } = mask;

            if(!width) width = x;
            if(!height) height = y;

            container.drawRect(x, y, x + width, y + height);
            container.pivot.x = width / 2;
            container.pivot.y = height / 2;
        }
        else if(type === 'circle') {
            container.drawCircle(x, y, mask.radius || 1);

            container.x = view.width / 2;
            container.y = view.height / 2;
        }

        container.endFill();

        if (!mask.isDebug) view.mask = container;
        view.addChild(container);
    }

    protected setEntity(options: IEntityOptions, view: Container): void {
        const entity = options.instance ? options.instance(view) : new PixiEntity(Utils.uuid(), `Entity-${view.name}`);
        const components = options.components || [];
        this.setComponents(entity, [view, ...components]);

        const entityStorage = ServiceContainer.instance.get(EntityStorage);
        const viewEntity = ServiceContainer.instance.get(ViewEntity)

        entityStorage.addEntity(entity);
        viewEntity.add(view, entity);

        view.on('destroyed', () => {
            entityStorage.removeEntity(entity.uuid);
        });
    }

    protected setComponents(entity: IEntity, components: Component[]): void {
        components.forEach((component) => entity.addComponent(component));
    }

    protected setDebugBorder(view: Container, width: number, color: number): void {
        const border = new Graphics();
        border.lineStyle(width, color, width).drawRect(-width, -width, view.width + width, view.height + width);
        border.pivot.x = view.width / 2;
        border.pivot.y = view.height / 2;

        view.addChild(border);
    }
}
