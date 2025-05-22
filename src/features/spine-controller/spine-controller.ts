import { ISpineChain, ISpineController } from '@shared/spine-controller';
import { SpineChain } from './spine-chain';

export class SpineController implements ISpineController {
    private _chains: Map<string, SpineChain> = new Map();

    private get _spineChains(): SpineChain[] {
        return Array.from(this._chains.values());
    }

    public create(name: string): SpineChain {
        const chain = new SpineChain(name, this);
        this._chains.set(name, chain);

        return chain;
    }

    public get(name: string): ISpineChain | undefined {
        return this._chains.get(name);
    }

    public remove(name: string): void {
        if (this._chains.has(name)) {
            this._chains.delete(name);
        }
    }

    public removeAll(): void {
        for (const [key] of this._chains.entries()) {
            this.remove(key);
        }
    }

    public multyplyTimeScaleAll(timeScaleMultiplier: number): void {
        this._spineChains.forEach((chain) => chain.multiplyTimeScale(timeScaleMultiplier));
    }

    public multyplyTimeScale(name: string, timeScaleMultiplier: number): void {
        const chain = this.get(name);
        chain?.multiplyTimeScale(timeScaleMultiplier);
    }

    public increaseTimeScaleAll(timescaleModifier: number): void {
        this._spineChains.forEach((chain) => chain.increaseTimeScale(timescaleModifier));
    }

    public increaseTimeScale(name: string, timescaleModifier: number): void {
        const chain = this.get(name);
        chain?.increaseTimeScale(timescaleModifier);
    }

    public decreaseTimeScaleAll(timescaleModifier: number): void {
        this._spineChains.forEach((chain) => chain.decreaseTimeScale(timescaleModifier));
    }

    public decreaseTimeScale(name: string, timescaleModifier: number): void {
        const chain = this.get(name);
        chain?.decreaseTimeScale(timescaleModifier);
    }

    public pauseAll(): void {
        this._spineChains.forEach((chain) => chain.pause());
    }

    public pause(name: string): void {
        const chain = this.get(name);
        chain?.pause();
    }

    public resumeAll(): void {
        this._spineChains.forEach((chain) => chain.resume());
    }

    public resume(name: string): void {
        const chain = this.get(name);
        chain?.resume();
    }

    public stopAll(isForceStop: boolean = false): void {
        this._spineChains.forEach((chain) => chain.stop(isForceStop));
    }

    public stop(name: string, isForceStop: boolean = false): void {
        const chain = this.get(name);
        chain?.stop(isForceStop);
    }
}
