import { FLT_EPSILON } from '../data';
import { Action } from './action';
import { FiniteTimeAction } from './finite-time-action';

export class ActionInterval extends FiniteTimeAction {
    protected MAX_VALUE = 2;
    protected _elapsed = 0;
    protected _firstTick = false;
    protected _easeList: Function[] = [];
    protected _speed = 1;
    protected _repeatForever = false;
    _repeatMethod = false;
    protected _speedMethod = false;

    constructor(d?: number) {
        super();
        if (d !== undefined && !Number.isNaN(d)) {
            this.initWithDuration(d);
        }
    }

    public getElapsed(): number {
        return this._elapsed;
    }

    public initWithDuration(d: number): boolean {
        this._duration = d === 0 ? FLT_EPSILON : d;
        // prevent division by 0
        // This comparison could be in step:, but it might decrease the performance
        // by 3% in heavy based action games.
        this._elapsed = 0;
        this._firstTick = true;
        return true;
    }

    public isDone(): boolean {
        return this._elapsed >= this._duration;
    }

    public clone(): ActionInterval {
        const action = new ActionInterval(this._duration);
        this.cloneDecoration(action);
        return action;
    }

    public easing(easeObj: any): ActionInterval {
        if (this._easeList) this._easeList.length = 0;
        else this._easeList = [];

        for (let i = 0; i < arguments.length; i++) this._easeList.push(arguments[i]);
        return this;
    }

    public step(dt: number): void {
        if (this._firstTick) {
            this._firstTick = false;
            this._elapsed = 0;
        } else this._elapsed += dt;

        let t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
        t = t < 1 ? t : 1;
        this.update(t > 0 ? t : 0);

        if (this._repeatMethod && this._timesForRepeat > 1 && this.isDone()) {
            if (!this._repeatForever) {
                this._timesForRepeat--;
            }

            this.startWithTarget(this.target);

            this.step(this._elapsed - this._duration);
        }
    }

    public startWithTarget(target: any): void {
        Action.prototype.startWithTarget.call(this, target);
        this._elapsed = 0;
        this._firstTick = true;
    }

    public reverse(): ActionInterval {
        return this;
    }

    public setAmplitudeRate(amp: any): void {}

    public getAmplitudeRate(): number {
        return 0;
    }

    public speed(speed: number): Action {
        if (speed <= 0) {
            return this;
        }

        this._speedMethod = true;
        this._speed *= speed;
        return this;
    }

    public getSpeed(): number {
        return this._speed;
    }

    public setSpeed(speed: number): ActionInterval {
        this._speed = speed;
        return this;
    }

    public repeat(times: number): ActionInterval {
        times = Math.round(times);
        if (Number.isNaN(times) || times < 1) {
            return this;
        }
        this._repeatMethod = true;
        this._timesForRepeat *= times;
        return this;
    }

    public repeatForever(): ActionInterval {
        this._repeatMethod = true;
        this._timesForRepeat = this.MAX_VALUE;
        this._repeatForever = true;
        return this;
    }

    public cloneDecoration(action: ActionInterval): void {
        action._repeatForever = this._repeatForever;
        action._speed = this._speed;
        action._timesForRepeat = this._timesForRepeat;
        action._easeList = this._easeList;
        action._speedMethod = this._speedMethod;
        action._repeatMethod = this._repeatMethod;
    }

    public reverseEaseList(action: ActionInterval): void {
        if (this._easeList) {
            action._easeList = [];
            for (let i = 0; i < this._easeList.length; i++) {
                action._easeList.push(this._easeList[i]);
            }
        }
    }

    public computeEaseTime(dt: any): any {
        return dt;
    }
}
