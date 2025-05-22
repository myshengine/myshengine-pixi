import { Action, ActionInterval, FiniteTimeAction } from '../core';
import { DelayTime } from './delay-time.action';
import { Sequence } from './sequence.action';

export class Spawn extends ActionInterval {
    static _actionOneTwo = function (action1: any, action2: any): Spawn {
        const pSpawn = new Spawn();
        pSpawn.initWithTwoActions(action1, action2);
        return pSpawn;
    };

    private _one: ActionInterval | null = null;
    private _two: ActionInterval | null = null;

    constructor(tempArray?: any) {
        super();

        const paramArray = tempArray instanceof Array ? tempArray : arguments;
        if (paramArray.length === 1) {
            return;
        }
        const last = paramArray.length - 1;

        if (last >= 0) {
            let prev = paramArray[0];
            let action1: any;
            for (let i = 1; i < last; i++) {
                if (paramArray[i]) {
                    action1 = prev;
                    prev = Spawn._actionOneTwo(action1, paramArray[i]);
                }
            }
            this.initWithTwoActions(prev, paramArray[last]);
        }
    }

    public initWithTwoActions(action1: any, action2: any): boolean {
        if (!action1 || !action2) {
            return false;
        }

        let ret = false;

        const d1 = action1._duration;
        const d2 = action2._duration;

        if (this.initWithDuration(Math.max(d1 as number, d2 as number))) {
            this._one = action1;
            this._two = action2;

            if (d1 > d2) {
                this._two = Sequence._actionOneTwo(action2 as ActionInterval, new DelayTime(d1 - d2));
            } else if (d1 < d2) {
                this._one = Sequence._actionOneTwo(action1 as ActionInterval, new DelayTime(d2 - d1));
            }

            ret = true;
        }
        return ret;
    }

    public clone(): Spawn {
        const action = new Spawn();
        this.cloneDecoration(action);
        action.initWithTwoActions(this._one!.clone(), this._two!.clone());
        return action;
    }

    public startWithTarget(target: any): void {
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._one!.startWithTarget(target);
        this._two!.startWithTarget(target);
    }

    public stop(): void {
        this._one!.stop();
        this._two!.stop();
        Action.prototype.stop.call(this);
    }

    public update(dt: any): void {
        dt = this.computeEaseTime(dt);
        if (this._one) this._one.update(dt as number);
        if (this._two) this._two.update(dt as number);
    }

    public reverse(): any {
        const action = Spawn._actionOneTwo(this._one!.reverse(), this._two!.reverse());
        this.cloneDecoration(action);
        this.reverseEaseList(action);
        return action as any;
    }
}

export function spawn(/* Multiple Arguments */ tempArray: any): FiniteTimeAction {
    const paramArray = tempArray instanceof Array ? tempArray : arguments;
    if (paramArray.length === 1) {
        return null as any;
    }

    let prev = paramArray[0];
    for (let i = 1; i < paramArray.length; i++) {
        if (paramArray[i] != null) prev = Spawn._actionOneTwo(prev, paramArray[i]);
    }
    return prev as FiniteTimeAction;
}
