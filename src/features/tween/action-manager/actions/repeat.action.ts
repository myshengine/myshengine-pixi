import { Action, ActionInstant, ActionInterval, FiniteTimeAction } from '../core';

export class Repeat extends ActionInterval {
    private _times = 0;
    private _total = 0;
    private _nextDt = 0;
    private _actionInstant = false;
    private _innerAction: FiniteTimeAction | null = null;

    constructor(action?: any, times?: any) {
        super();
        times !== undefined && this.initWithAction(action as FiniteTimeAction, times as number);
    }

    public initWithAction(action: FiniteTimeAction, times: number): boolean {
        const duration = action._duration * times;

        if (this.initWithDuration(duration)) {
            this._times = times;
            this._innerAction = action;
            if (action instanceof ActionInstant) {
                this._actionInstant = true;
                this._times -= 1;
            }
            this._total = 0;
            return true;
        }
        return false;
    }

    public clone(): Repeat {
        const action = new Repeat();
        this.cloneDecoration(action);
        action.initWithAction(this._innerAction!.clone(), this._times);
        return action;
    }

    public startWithTarget(target: any): void {
        this._total = 0;
        this._nextDt = this._innerAction!._duration / this._duration;
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._innerAction!.startWithTarget(target);
    }

    public stop(): void {
        this._innerAction!.stop();
        Action.prototype.stop.call(this);
    }

    public update(dt: number): void {
        dt = this.computeEaseTime(dt);
        const locInnerAction = this._innerAction!;
        const locDuration = this._duration;
        const locTimes = this._times;
        let locNextDt = this._nextDt;

        if (dt >= locNextDt) {
            while (dt > locNextDt && this._total < locTimes) {
                locInnerAction.update(1);
                this._total++;
                locInnerAction.stop();
                locInnerAction.startWithTarget(this.target);
                locNextDt += locInnerAction._duration / locDuration;
                this._nextDt = locNextDt > 1 ? 1 : locNextDt;
            }

            // fix for issue #1288, incorrect end value of repeat
            if (dt >= 1.0 && this._total < locTimes) {
                // fix for cocos-creator/fireball/issues/4310
                locInnerAction.update(1);
                this._total++;
            }

            // don't set a instant action back or update it, it has no use because it has no duration
            if (!this._actionInstant) {
                if (this._total === locTimes) {
                    locInnerAction.stop();
                } else {
                    // issue #390 prevent jerk, use right update
                    locInnerAction.update(dt - (locNextDt - locInnerAction._duration / locDuration));
                }
            }
        } else {
            locInnerAction.update((dt * locTimes) % 1.0);
        }
    }

    public isDone(): boolean {
        return this._total === this._times;
    }

    public reverse(): any {
        const action = new Repeat(this._innerAction!.reverse(), this._times);
        this.cloneDecoration(action);
        this.reverseEaseList(action);
        return action as any;
    }

    public setInnerAction(action: any): void {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    }

    public getInnerAction(): FiniteTimeAction | null {
        return this._innerAction;
    }
}
