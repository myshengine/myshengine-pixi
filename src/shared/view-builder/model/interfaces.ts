import { BitmapText, Container, IBitmapTextStyle, ITextStyle, NineSlicePlane, Polygon, Sprite, Text } from 'pixi.js';
import { EntityFactory, PixiEventMode, PixiEventType, TreeNode, ViewType } from './types';
import { Component } from 'myshengine-core';
import { IAssetable } from '@shared/assets-manager';
import { Spine } from 'pixi-spine';

export interface IBuilderBehaviour<T extends IDisplayObjectOptions> {
    create(options: T): Container;
}

export interface IVec2 {
    x?: number;
    y?: number;
}

export interface IAnchorable {
    anchor?: IVec2;
}

export interface IEntityOptions {
    storage?: string[];
    instance?: EntityFactory;
    components?: Component[];
}

export interface IInteractivityOptions {
    eventMode: PixiEventMode;
    cursor: string;
    events: { evnetType: PixiEventType; callback: (event: any) => void }[];
}

export interface IMaskOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: number;
    isDebug?: boolean;
}

export interface IDisplayObjectOptions {
    type: ViewType;
    name: string;
    entity?: IEntityOptions;
    interactiveChildren?: boolean;
    interactive?: IInteractivityOptions;
    hitArea?: Polygon;
    parentGroup?: string;
    zIndex?: number;
    zOrder?: number;
    visible?: boolean;
    position?: IVec2;
    relativePosition?: IVec2;
    pivot?: IVec2;
    scale?: IVec2;
    alpha?: number;
    rotation?: number;
    width?: number;
    height?: number;
    children?: TreeNode[];
    mask?: IMaskOptions;
    debugBorder?: boolean;
    debugBorderColor?: number;
    debugBorderWidth?: number;
    sortableChildren?: boolean;
}

export interface IContainerOptions extends IDisplayObjectOptions {
    type: ViewType<Container>;
    enableSort?: boolean;
}

export interface ISpriteOptions extends IDisplayObjectOptions, IAnchorable, IAssetable {
    type: ViewType<Sprite>;
    tint?: number;
}

export interface ITextOptions extends IDisplayObjectOptions, IAnchorable {
    type: ViewType<Text>;
    text: string;
    textStyle?: Partial<ITextStyle>;
}

export interface IBitmapTextOptions extends IDisplayObjectOptions, IAnchorable {
    type: ViewType<BitmapText>;
    text: string;
    bitmapTextStyle: IBitmapTextStyle;
    tint?: number;
}

export interface ISpineOptions extends IDisplayObjectOptions, IAssetable {
    type: ViewType<Spine>;
    key?: string;
    initialAnimation?: string;
    timeScale?: number;
    skin?: string;
    loop?: number;
}

export interface INineSliceOptions extends IDisplayObjectOptions, IAssetable {
    type: ViewType<NineSlicePlane>;
    leftWidth: number,
    topHeight: number,
    rightWidth: number,
    bottomHeight: number,
    tint?: number
}

export interface IViewBuilder {
    create(options: TreeNode, parent?: Container): Container | undefined;
}
