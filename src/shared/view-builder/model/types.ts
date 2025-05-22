import { IEntity } from 'myshengine-core';
import { Container, DisplayObject, ObservablePoint } from 'pixi.js';
import { IBitmapTextOptions, IContainerOptions, ISpineOptions, ISpriteOptions, ITextOptions } from './interfaces';

export type ViewType<T extends DisplayObject = DisplayObject> = new (...args: any[]) => T;

export type WithAnchor<T extends Container> = T & { anchor: ObservablePoint };

export type EntityFactory = (view: Container) => IEntity;

export type PixiEventMode = 'none' | 'passive' | 'auto' | 'static' | 'dynamic';

export type TreeNode = IContainerOptions | ISpriteOptions | ITextOptions | IBitmapTextOptions | ISpineOptions;

export type PixiEventType =
    | 'pointercancel'
    | 'pointerdown'
    | 'pointerenter'
    | 'pointerleave'
    | 'pointermove'
    | 'globalpointermove'
    | 'pointerout'
    | 'pointerover'
    | 'pointertap'
    | 'pointerup'
    | 'pointerupoutside'
    | 'mousedown'
    | 'mouseenter'
    | 'mouseleave'
    | 'mousemove'
    | 'globalmousemove'
    | 'mouseout'
    | 'mouseover'
    | 'mouseup'
    | 'mouseupoutside'
    | 'click'
    | 'touchcancel'
    | 'touchend'
    | 'touchendoutside'
    | 'touchmove'
    | 'globaltouchmove'
    | 'touchstart'
    | 'tap'
    | 'wheel'
    | 'rightclick'
    | 'rightdown'
    | 'rightup'
    | 'rightupoutside';
