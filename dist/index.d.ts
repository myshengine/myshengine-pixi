import { Application } from 'pixi.js';
import { BitmapText } from 'pixi.js';
import { Component } from 'myshengine-core';
import { ComponentFilter } from 'myshengine-core';
import { ComponentType } from 'myshengine-core';
import { Container } from 'pixi.js';
import { DeferredPromise } from 'myshengine-core';
import { DisplayObject } from 'pixi.js';
import { Entity } from 'myshengine-core';
import { Group } from '@pixi/layers';
import { IBitmapTextStyle } from 'pixi.js';
import { IEntity } from 'myshengine-core';
import { IEvent } from 'pixi-spine';
import { ITextStyle } from 'pixi.js';
import { ITrackEntry } from 'pixi-spine';
import { MyshApp } from 'myshengine-core';
import { ObservablePoint } from 'pixi.js';
import * as particles from '@pixi/particle-emitter';
import { Polygon } from 'pixi.js';
import { Signal } from 'myshengine-core';
import { SignalController } from 'myshengine-core';
import { Spine } from 'pixi-spine';
import { Sprite } from 'pixi.js';
import { Stage } from '@pixi/layers';
import { Text as Text_2 } from 'pixi.js';
import { UpdateLoop } from 'myshengine-core';

declare class Action {
    tag: number;
    protected originalTarget: Object | null;
    protected target: Object | null;
    clone(): Action;
    isDone(): boolean;
    startWithTarget(target: any): void;
    stop(): void;
    step(dt: number): void;
    update(dt: number): void;
    getTarget(): Object | null;
    setTarget(target: Object): void;
    getOriginalTarget(): Object | null;
    setOriginalTarget(originalTarget: any): void;
    reverse(): Action | null;
    retain(): void;
    release(): void;
}

declare class ActionInterval extends FiniteTimeAction {
    protected MAX_VALUE: number;
    protected _elapsed: number;
    protected _firstTick: boolean;
    protected _easeList: Function[];
    protected _speed: number;
    protected _repeatForever: boolean;
    _repeatMethod: boolean;
    protected _speedMethod: boolean;
    constructor(d?: number);
    getElapsed(): number;
    initWithDuration(d: number): boolean;
    isDone(): boolean;
    clone(): ActionInterval;
    easing(easeObj: any): ActionInterval;
    step(dt: number): void;
    startWithTarget(target: any): void;
    reverse(): ActionInterval;
    setAmplitudeRate(amp: any): void;
    getAmplitudeRate(): number;
    speed(speed: number): Action;
    getSpeed(): number;
    setSpeed(speed: number): ActionInterval;
    repeat(times: number): ActionInterval;
    repeatForever(): ActionInterval;
    cloneDecoration(action: ActionInterval): void;
    reverseEaseList(action: ActionInterval): void;
    computeEaseTime(dt: any): any;
}

declare class ActionManager {
    private _hashTargets;
    private _arrayTargets;
    private _currentTarget;
    private _elementPool;
    addAction(action: Action, target: Object, paused: boolean): void;
    removeAllActions(): void;
    removeAllActionsFromTarget(target: Object): void;
    removeAction(action: Action): void;
    _removeActionByTag(tag: number, element: any, target?: Object): void;
    _removeAllActionsByTag(tag: number, element: any, target?: Object): void;
    removeActionByTag(tag: number, target?: Object): void;
    removeAllActionsByTag(tag: number, target?: Object): void;
    getActionByTag(tag: number, target: Object): Action | null;
    getNumberOfRunningActionsInTarget(target: Object): number;
    pauseTarget(target: Object): void;
    resumeTarget(target: Object): void;
    pauseAllRunningActions(): Array<any>;
    resumeTargets(targetsToResume: Array<any>): void;
    pauseTargets(targetsToPause: Array<any>): void;
    private _removeActionAtIndex;
    update(dt: number): void;
    private _getElement;
    private _putElement;
    private _deleteHashElement;
    private _isActionInternal;
}

declare type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];

export declare class Asset implements IExternalResolvableAsset {
    private _name;
    data: IAssetData<any>[];
    status: AssetStatus;
    get name(): string;
    get loaded(): Promise<IAsset>;
    get resolve(): (value: IAsset) => void;
    private _resolve;
    private _loaded;
    constructor(_name: string);
    getAssetByName<T>(asset: string | IAssetConfig): IAssetData<T> | undefined;
}

export declare class AssetsManager implements IAssetsManager {
    list: Map<string, IExternalResolvableAsset>;
    add(name: string): void;
    updateOnLoad(name: string, assets: IAssetData<any>[]): void;
    getBundle(assetConfig: string | IAssetConfig): IAsset | undefined;
    getAsset<T>(assetConfig: string | IAssetConfig): IAssetData<T> | undefined;
    hasAsset<T>(assetConfig: string | IAssetConfig): boolean;
    private findParentBundle;
}

export declare enum AssetStatus {
    Pending = "Pending",
    Loaded = "Loaded"
}

declare type ConstructorType<T> = OmitType<T, Function>;

export declare type EntityFactory = (view: Container) => IEntity;

declare class FiniteTimeAction extends Action {
    _duration: number;
    _timesForRepeat: number;
    getDuration(): number;
    setDuration(duration: number): void;
    clone(): FiniteTimeAction;
}

declare type FlagExcludedType<Base, Type> = {
    [Key in keyof Base]: Base[Key] extends Type ? never : Key;
};

/**
 * @description FlowController controls game flow - pause, resume and set game speed.
 * @example
 * ```typescript
 * const flowController = new FlowController(updateLoop, signalController, spineController);
 * flowController.pause(); // pause all game logic
 * flowController.resume(); // resume all game logic
 * flowController.setGameSpeed(2); // set game speed to 2
 * ```
 */
export declare class FlowController {
    private _updateLoop;
    private _signalController;
    private _spineController;
    private _paused;
    private _gameSpeed;
    /**
     * @description is game paused
     */
    get paused(): boolean;
    /**
     * @description game speed multiplier
     */
    get gameSpeed(): number;
    constructor(_updateLoop: UpdateLoop, _signalController: SignalController, _spineController: SpineController);
    /**
     * @description pause all game logic - Systems, UpdateLoop and Spine.
     */
    pause(): void;
    /**
     * @description resume all game logic - Systems, UpdateLoop and Spine.
     */
    resume(): void;
    /**
     * @description set game speed - UpdateLoop and Spine.
     */
    setGameSpeed(speed: number): void;
}

export declare interface IAliasedResolution {
    width: number;
    height: number;
    alias: string;
}

export declare interface IAnchorable {
    anchor?: IVec2;
}

export declare interface IAsset {
    status: AssetStatus;
    data: IAssetData<any>[];
    name: string;
    loaded: Promise<IAsset>;
    getAssetByName<T>(asset: string | IAssetConfig): IAssetData<T> | undefined;
}

export declare interface IAssetable {
    asset: string | IAssetConfig;
}

export declare interface IAssetConfig {
    bundle: string;
    name: string;
}

export declare interface IAssetData<T> {
    name: string;
    bundle: string;
    asset: T;
}

export declare interface IAssetsManager {
    list: Map<string, IExternalResolvableAsset>;
    add(name: string): void;
    updateOnLoad(name: string, assets: IAssetData<any>[]): void;
    getBundle(assetConfig: string | IAssetConfig): IAsset | undefined;
    getAsset<T>(assetConfig: string | IAssetConfig): IAssetData<T> | undefined;
    hasAsset<T>(assetConfig: string | IAssetConfig): boolean;
}

export declare interface IBitmapTextOptions extends IDisplayObjectOptions, IAnchorable {
    type: ViewType<BitmapText>;
    text: string;
    bitmapTextStyle: IBitmapTextStyle;
    tint?: number;
}

export declare interface IBuilderBehaviour<T extends IDisplayObjectOptions> {
    create(options: T): Container;
}

export declare interface IBundle {
    name: string;
    assets: IBundleAsset[];
}

export declare interface IBundleAsset {
    name: string;
    srcs: string | string[];
}

export declare interface IContainerOptions extends IDisplayObjectOptions {
    type: ViewType<Container>;
    enableSort?: boolean;
}

export declare interface IDisplayObjectOptions {
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

export declare interface IEntityOptions {
    storage?: string[];
    instance?: EntityFactory;
    components?: Component[];
}

export declare interface IExternalResolvableAsset extends IAsset {
    resolve: (value: IAsset) => void;
}

export declare interface IInteractivityOptions {
    eventMode: PixiEventMode;
    cursor: string;
    events: {
        evnetType: PixiEventType;
        callback: (event: any) => void;
    }[];
}

export declare interface ILayerOptions {
    name: string;
    order?: number;
    sortable?: boolean;
}

export declare interface ILayers {
    setStage(stage: Stage): void;
    createGroups(name: string, order: number, sortable: boolean): void;
    getGroup(name: string): Group | undefined;
    setLayer(name: string, node: Container): void;
    setOrder(node: Container, zOrder: number): void;
    sort(name: string): void;
    sortAll(): void;
}

export declare interface ILoader {
    dimension: string;
    init(config: ILoaderConfig): Promise<void>;
    loadBundle(name: string): Promise<void>;
}

export declare interface ILoaderConfig {
    manifest: IManifest;
    resolutions: IAliasedResolution[];
    ignoreFormats?: string[];
}

export declare interface IManifest {
    bundles: IBundle[];
}

export declare interface IMaskOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: number;
    isDebug?: boolean;
}

export declare interface IParticleEmitter {
    createParticleEmitter(name: string, parent: Container, config: any): particles.Emitter;
    update(dt: number): void;
    emit(name: string): void;
    emitAll(): void;
}

export declare interface IPoolItemFactory<T> {
    create(): T;
    reset(item: T): void;
}

export declare interface IPoolsController {
    create<T>(name: string, factory: new () => IPoolItemFactory<T>, size: number, dynamic?: boolean): ObjectPool<T>;
    get<T>(name: string): ObjectPool<T>;
}

export declare interface IScene {
    init(parent: Container): Container;
    destroy(): void;
}

export declare interface ISpineChain {
    current: ISpineChainItem | null;
    promises: DeferredPromise<any>[];
    add(spine: Spine, name: string, options: ISpineChainOptions): ISpineChain;
    play(): Promise<any>;
    stop(isForceStop: boolean): void;
    multiplyTimeScale(timeScaleMultiplier: number): void;
    increaseTimeScale(timescaleModifier: number): void;
    decreaseTimeScale(timescaleModifier: number): void;
    pause(): void;
    resume(): void;
}

export declare interface ISpineChainItem {
    spine: Spine;
    name: string;
    options: ISpineChainOptions;
    deferredPromise: DeferredPromise<any>;
}

export declare interface ISpineChainOptions {
    loopCount?: number;
    timeScale?: number;
    start?(entry: ITrackEntry): void;
    interrupt?(entry: ITrackEntry): void;
    end?(entry: ITrackEntry): void;
    dispose?(entry: ITrackEntry): void;
    complete?(entry: ITrackEntry): void;
    event?(entry: ITrackEntry, event: IEvent): void;
}

export declare interface ISpineController {
    create(name: string): ISpineChain;
    get(name: string): ISpineChain | undefined;
    remove(name: string): void;
    removeAll(): void;
    multyplyTimeScaleAll(timeScaleMultiplier: number): void;
    multyplyTimeScale(name: string, timeScaleMultiplier: number): void;
    increaseTimeScaleAll(timescaleModifier: number): void;
    increaseTimeScale(name: string, timescaleModifier: number): void;
    decreaseTimeScaleAll(timescaleModifier: number): void;
    decreaseTimeScale(name: string, timescaleModifier: number): void;
    pauseAll(): void;
    pause(name: string): void;
    resumeAll(): void;
    resume(name: string): void;
    stopAll(isForceStop: boolean): void;
    stop(name: string, isForceStop: boolean): void;
}

export declare interface ISpineOptions extends IDisplayObjectOptions, IAssetable {
    type: ViewType<Spine>;
    key?: string;
    initialAnimation?: string;
    timeScale?: number;
    skin?: string;
    loop?: number;
}

export declare interface ISpineUtils {
    getDuration(spine: Spine, name: string): number;
    findSlotIndex(spine: Spine, name: string): number;
    findSlotByName(spine: Spine, name: string): Container;
    setSlotAlpha(spine: Spine, nameSlot: string, alpha: number): void;
    addToSlot(spine: Spine, slotName: string, child: Container): void;
    setSkin(spine: Spine, skinName: string): void;
}

export declare interface ISpriteOptions extends IDisplayObjectOptions, IAnchorable, IAssetable {
    type: ViewType<Sprite>;
    tint?: number;
}

export declare interface ITextOptions extends IDisplayObjectOptions, IAnchorable {
    type: ViewType<Text_2>;
    text: string;
    textStyle?: Partial<ITextStyle>;
}

export declare interface ITweenOption {
    easing?: TweenEasing | ((k: number) => number);
    progress?: (start: number, end: number, current: number, ratio: number) => number;
    onStart?: (target?: object) => void;
    onUpdate?: (target?: object, ratio?: number) => void;
    onComplete?: (target?: object) => void;
}

export declare interface IVec2 {
    x?: number;
    y?: number;
}

export declare interface IViewBuilder {
    create(options: TreeNode, parent?: Container): Container | undefined;
}

export declare interface IViewEntity {
    add(view: Container, entity: IEntity): void;
    get(view: Container): IEntity | null;
    getInChildren(view: Container): IEntity[];
    getInChildrenByFilter(view: Container, filter: ComponentFilter): IEntity[];
    getComponent<T extends Component>(view: Container, type: ComponentType<T>): T;
}

declare type KeyPartial<T, K extends keyof T> = {
    [P in K]?: T[P];
};

export declare class Layers implements ILayers {
    private _groups;
    private _layers;
    private _stage;
    setStage(stage: Stage): void;
    createGroups(name: string, order: number, sortable: boolean): void;
    getGroup(name: string): Group | undefined;
    setLayer(name: string, node: Container): void;
    setOrder(node: Container, zOrder: number): void;
    sort(name: string): void;
    sortAll(): void;
}

export declare class Loader implements ILoader {
    private _assetsManager;
    get dimension(): string;
    private _dimension;
    private _behaviours;
    constructor(_assetsManager: IAssetsManager);
    init(config: ILoaderConfig): Promise<void>;
    loadBundle(name: string): Promise<void>;
    private processBundle;
    private setupBehaviours;
    private closestDimension;
    private checkWebPSupport;
    private selectResolution;
    private selectWebp;
    private ignoreFormats;
}

export declare class MyshPixiApp extends MyshApp {
    connectRender(pixi: Application, parent: HTMLDivElement): void;
    init(): void;
    private update;
    private appendToDOM;
    private connectDebugger;
    private initializeDependencies;
    private createStage;
    private createRootView;
}

export declare class ObjectPool<T> {
    private _factory;
    private _size;
    private _dynamic?;
    get size(): number;
    get currentSize(): number;
    private _pool;
    constructor(_factory: IPoolItemFactory<T>, _size: number, _dynamic?: boolean | undefined);
    private intitialize;
    get(): T | undefined;
    release(item: T): void;
}

declare type OmitType<Base, Type> = KeyPartial<Base, AllowedNames<Base, Type>>;

export declare const OnViewCreatedSignal: Signal<Container<DisplayObject>>;

export declare class ParticleEmitter implements IParticleEmitter {
    private _emitters;
    createParticleEmitter(name: string, parent: Container, config: any): particles.Emitter;
    update(dt: number): void;
    emit(name: string): void;
    emitAll(): void;
}

export declare class PixiEntity extends Entity {
    get active(): boolean;
    set active(value: boolean);
}

export declare type PixiEventMode = 'none' | 'passive' | 'auto' | 'static' | 'dynamic';

export declare type PixiEventType = 'pointercancel' | 'pointerdown' | 'pointerenter' | 'pointerleave' | 'pointermove' | 'globalpointermove' | 'pointerout' | 'pointerover' | 'pointertap' | 'pointerup' | 'pointerupoutside' | 'mousedown' | 'mouseenter' | 'mouseleave' | 'mousemove' | 'globalmousemove' | 'mouseout' | 'mouseover' | 'mouseup' | 'mouseupoutside' | 'click' | 'touchcancel' | 'touchend' | 'touchendoutside' | 'touchmove' | 'globaltouchmove' | 'touchstart' | 'tap' | 'wheel' | 'rightclick' | 'rightdown' | 'rightup' | 'rightupoutside';

export declare abstract class PixiItemPoolFactory<T extends Container> implements IPoolItemFactory<T> {
    protected config: TreeNode | null;
    protected createFromConfig(config: TreeNode): T;
    abstract create(): T;
    abstract reset(item: T): void;
}

export declare type PixiType<T extends DisplayObject> = new (...args: any[]) => T;

export declare class PoolsController implements IPoolsController {
    private _pools;
    create<T>(name: string, factory: new () => IPoolItemFactory<T>, size: number, dynamic?: boolean): ObjectPool<T>;
    get<T>(name: string): ObjectPool<T>;
}

export declare abstract class Scene implements IScene {
    private _viewBuilder;
    private _view;
    constructor(_viewBuilder: ViewBuilder);
    init(parent: Container): Container;
    destroy(): void;
    protected abstract setup(): TreeNode;
}

export declare class SceneController {
    private _pixi;
    private _viewBuilder;
    private _layers;
    private _currentScene;
    constructor(_pixi: Application, _viewBuilder: ViewBuilder, _layers: Layers);
    setScene<T extends IScene>(scene: SceneType<T>): void;
    addLayer(layer: ILayerOptions): void;
    setShared(config: TreeNode): void;
    removeFromShared(name: string): void;
}

export declare type SceneType<T extends IScene> = new (...args: any[]) => T;

declare class SpineChain implements ISpineChain {
    private _name;
    private _spineController;
    get current(): ISpineChainItem | null;
    get promises(): DeferredPromise<any>[];
    private _timescaleModifier;
    private _timeScaleMiltiplier;
    private _chain;
    private _curent;
    private _listener;
    private _originalTimeScale;
    constructor(_name: string, _spineController: SpineController);
    add(spine: Spine, name: string, options?: ISpineChainOptions): ISpineChain;
    play(): Promise<any>;
    stop(isForceStop?: boolean): void;
    multiplyTimeScale(timeScaleMultiplier: number): void;
    increaseTimeScale(timescaleModifier: number): void;
    decreaseTimeScale(timescaleModifier: number): void;
    pause(): void;
    resume(): void;
    private setListener;
    private clear;
}

export declare class SpineController implements ISpineController {
    private _chains;
    private get _spineChains();
    create(name: string): SpineChain;
    get(name: string): ISpineChain | undefined;
    remove(name: string): void;
    removeAll(): void;
    multyplyTimeScaleAll(timeScaleMultiplier: number): void;
    multyplyTimeScale(name: string, timeScaleMultiplier: number): void;
    increaseTimeScaleAll(timescaleModifier: number): void;
    increaseTimeScale(name: string, timescaleModifier: number): void;
    decreaseTimeScaleAll(timescaleModifier: number): void;
    decreaseTimeScale(name: string, timescaleModifier: number): void;
    pauseAll(): void;
    pause(name: string): void;
    resumeAll(): void;
    resume(name: string): void;
    stopAll(isForceStop?: boolean): void;
    stop(name: string, isForceStop?: boolean): void;
}

export declare class SpineUtils implements ISpineUtils {
    getDuration(spine: Spine, name: string): number;
    findSlotIndex(spine: Spine, name: string): number;
    findSlotByName(spine: Spine, name: string): Container;
    setSlotAlpha(spine: Spine, nameSlot: string, alpha: number): void;
    addToSlot(spine: Spine, slotName: string, child: Container): void;
    setSkin(spine: Spine, skinName: string): void;
}

export declare type TreeNode = IContainerOptions | ISpriteOptions | ITextOptions | IBitmapTextOptions | ISpineOptions;

export declare class Tween<T> {
    set tag(value: number);
    private _actions;
    private _finalAction;
    private _target;
    private _tag;
    constructor(target?: T | null);
    then(other: Tween<T>): Tween<T>;
    target(target: T): Tween<T | undefined>;
    start(): Tween<T>;
    stop(): Tween<T>;
    clone(target: T): Tween<T>;
    union(): Tween<T>;
    to(duration: number, props: ConstructorType<T>, opts?: ITweenOption): Tween<T>;
    from(duration: number, props: ConstructorType<T>, opts?: ITweenOption): Tween<T>;
    set(props: ConstructorType<T>): Tween<T>;
    delay(duration: number): Tween<T>;
    call(callback: Function): Tween<T>;
    sequence(...args: Tween<T>[]): Tween<T>;
    parallel(...args: Tween<T>[]): Tween<T>;
    repeat(repeatTimes: number, embedTween?: Tween<T>): Tween<T>;
    repeatForever(embedTween?: Tween<T>): Tween<T>;
    reverseTime(embedTween?: Tween<T>): Tween<T>;
    static stopAll(): void;
    static stopAllByTag(tag: number, target?: object): void;
    static stopAllByTarget(target?: object): void;
    private _union;
    private static readonly _tmp_args;
    private static _wrappedSequence;
    private static _wrappedParallel;
}

export declare class TweenAction extends ActionInterval {
    private _opts;
    private _props;
    private _originProps;
    constructor(duration: number, props: any, opts?: ITweenOption);
    clone(): TweenAction;
    startWithTarget(target: Record<string, unknown>): void;
    update(t: number): void;
    progress(start: number, end: number, current: number, t: number): number;
}

declare type TweenEasing = 'linear' | 'smooth' | 'fade' | 'constant' | 'quadIn' | 'quadOut' | 'quadInOut' | 'quadOutIn' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'cubicOutIn' | 'quartIn' | 'quartOut' | 'quartInOut' | 'quartOutIn' | 'quintIn' | 'quintOut' | 'quintInOut' | 'quintOutIn' | 'sineIn' | 'sineOut' | 'sineInOut' | 'sineOutIn' | 'expoIn' | 'expoOut' | 'expoInOut' | 'expoOutIn' | 'circIn' | 'circOut' | 'circInOut' | 'circOutIn' | 'elasticIn' | 'elasticOut' | 'elasticInOut' | 'elasticOutIn' | 'backIn' | 'backOut' | 'backInOut' | 'backOutIn' | 'bounceIn' | 'bounceOut' | 'bounceInOut' | 'bounceOutIn';

export declare class TweenSystem {
    private static _instance;
    static get instance(): TweenSystem;
    get ActionManager(): ActionManager;
    private readonly actionMgr;
    update(dt: number): void;
}

export declare class ViewBuilder implements IViewBuilder {
    private _assetsManager;
    private _behaviours;
    constructor(_assetsManager: IAssetsManager);
    create(options: TreeNode, parent?: Container): Container | undefined;
    private setupBehaviours;
    private createChildren;
    private loadLazyAsset;
}

export declare class ViewEntity implements IViewEntity {
    private _list;
    add(view: Container, entity: IEntity): void;
    get(view: Container): IEntity | null;
    getInChildren(view: Container): IEntity[];
    getInChildrenByFilter(view: Container, filter: ComponentFilter): IEntity[];
    getComponent<T extends Component>(view: Container, type: ComponentType<T>): T;
}

export declare type ViewType<T extends DisplayObject = DisplayObject> = new (...args: any[]) => T;

export declare type WithAnchor<T extends Container> = T & {
    anchor: ObservablePoint;
};

export { }
