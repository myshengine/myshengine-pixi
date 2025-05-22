import { DeferredPromise } from 'myshengine-core';
import { IEvent, ITrackEntry, Spine } from 'pixi-spine';
import { Container } from 'pixi.js';

export interface ISpineChainOptions {
    loopCount?: number;
    timeScale?: number;
    start?(entry: ITrackEntry): void;
    interrupt?(entry: ITrackEntry): void;
    end?(entry: ITrackEntry): void;
    dispose?(entry: ITrackEntry): void;
    complete?(entry: ITrackEntry): void;
    event?(entry: ITrackEntry, event: IEvent): void;
}

export interface ISpineChainItem {
    spine: Spine;
    name: string;
    options: ISpineChainOptions;
    deferredPromise: DeferredPromise<any>;
}

export interface ISpineChain {
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

export interface ISpineController {
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

export interface ISpineUtils {
    getDuration(spine: Spine, name: string): number;
    findSlotIndex(spine: Spine, name: string): number;
    findSlotByName(spine: Spine, name: string): Container;
    setSlotAlpha(spine: Spine, nameSlot: string, alpha: number): void;
    addToSlot(spine: Spine, slotName: string, child: Container): void;
    setSkin(spine: Spine, skinName: string): void;
}
