import { Spine, IAnimationStateListener, ITrackEntry, IEvent } from 'pixi-spine';

import { DeferredPromise } from 'myshengine-core';
import { SpineController } from './spine-controller';
import { ISpineChain, ISpineChainItem, ISpineChainOptions } from '@shared/spine-controller';

export class SpineChain implements ISpineChain {
    public get current(): ISpineChainItem | null {
        return this._curent;
    }

    public get promises(): DeferredPromise<any>[] {
        return this._chain.map(({ deferredPromise }) => deferredPromise);
    }

    private _timescaleModifier: number = 0;
    private _timeScaleMiltiplier: number = 1;
    private _chain: ISpineChainItem[] = [];
    private _curent: ISpineChainItem | null = null;
    private _listener: IAnimationStateListener | null = null;
    private _originalTimeScale: number = 0;

    constructor(
        private _name: string,
        private _spineController: SpineController,
    ) {}

    public add(spine: Spine, name: string, options: ISpineChainOptions = { loopCount: 1, timeScale: 1 }): ISpineChain {
        const chain: ISpineChainItem[] = [];

        if (options.loopCount === undefined) options.loopCount = 1;
        if (options.timeScale === undefined) options.timeScale = 1;

        if (options.loopCount !== -1) {
            for (let i = 0; i < options.loopCount; i++) {
                const deferredPromise = new DeferredPromise();
                chain.push({ spine, name, options, deferredPromise });
            }
        } else {
            const deferredPromise = new DeferredPromise();
            chain.push({ spine, name, options, deferredPromise });
            console.warn('[SpineChainsUtil]: loopCount -1 looped your animation forever!');
        }

        this._chain.push(...chain);
        return this;
    }

    public async play(): Promise<any> {
        while (this._chain.length > 0) {
            const chain = (this._curent = this._chain[0]);
            const { spine, name, deferredPromise, options } = chain;
            const { loopCount, timeScale } = options;

            if (loopCount === -1) {
                this.add(spine, name, options);
            }

            spine.state.timeScale = timeScale || 0;
            this._originalTimeScale = spine.state.timeScale;

            if (timeScale) {
                spine.state.timeScale = (timeScale + this._timescaleModifier) * this._timeScaleMiltiplier;
            }

            this._listener && spine.state.removeListener(this._listener);
            this.clear(spine);

            this._listener = this.setListener(options, deferredPromise);

            spine.state.addListener(this._listener);
            spine.state.setAnimation(0, name, false);
            await deferredPromise.promise;
            this._chain.shift();
        }

        this._spineController.remove(this._name);
    }

    public stop(isForceStop: boolean = false): void {
        if (isForceStop) {
            this._chain.forEach((chain) => this.clear(chain.spine));
        }

        const promises = this.promises;
        DeferredPromise.resolveAll(promises, undefined);

        this._chain.length = 0;
        this._spineController.remove(this._name);
    }

    public multiplyTimeScale(timeScaleMultiplier: number): void {
        if (!this._curent) return;
        if (timeScaleMultiplier <= 0) timeScaleMultiplier = 1;

        this._timeScaleMiltiplier = timeScaleMultiplier;
        this._curent.spine.state.timeScale = (this._originalTimeScale + this._timescaleModifier) * timeScaleMultiplier;
    }

    public increaseTimeScale(timescaleModifier: number): void {
        if (!this._curent) return;
        this._timescaleModifier = timescaleModifier;
        this._curent.spine.state.timeScale += timescaleModifier;
    }

    public decreaseTimeScale(timescaleModifier: number): void {
        if (!this._curent) return;
        this._timescaleModifier = 0;
        this._curent.spine.state.timeScale -= timescaleModifier;
    }

    public pause(): void {
        if (!this._curent) return;

        this._originalTimeScale = this._curent.spine.state.timeScale;
        this._curent.spine.state.timeScale = 0;
    }

    public resume(): void {
        if (!this._curent) return;
        this._curent.spine.state.timeScale = this._originalTimeScale + this._timescaleModifier;
    }

    private setListener(options: ISpineChainOptions, deferredPromise: DeferredPromise<any>): IAnimationStateListener {
        return {
            start: (event: ITrackEntry) => {
                options.start && options.start(event);
            },
            interrupt: (entry: ITrackEntry) => {
                options.interrupt && options.interrupt(entry);
            },
            end: (entry: ITrackEntry) => {
                options.end && options.end(entry);
            },
            dispose: (entry: ITrackEntry) => {
                options.dispose && options.dispose(entry);
            },
            complete: (entry: ITrackEntry) => {
                options.complete && options.complete(entry);
                deferredPromise.resolve(true);
            },
            event: (entry: ITrackEntry, event: IEvent) => {
                options.event && options.event(entry, event);
            },
        };
    }

    private clear(spine: Spine): void {
        spine.state.clearTracks();
        spine.state.tracks = [];
        spine.skeleton.setToSetupPose();
        this._listener && spine.state.removeListener(this._listener);

        // @ts-ignore
        spine.lastTime = null;
    }
}
