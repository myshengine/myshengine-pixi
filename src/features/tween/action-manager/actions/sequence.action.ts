import { Action, ActionInterval, FiniteTimeAction } from '../core';

export class Sequence extends ActionInterval {
    static _actionOneTwo = function (actionOne: ActionInterval, actionTwo: ActionInterval): Sequence {
        const sequence = new Sequence();
        sequence.initWithTwoActions(actionOne, actionTwo);
        return sequence;
    };

    private _actions: ActionInterval[] = [];
    private _split = 0;
    private _last = 0;
    private _reversed = false;

    constructor(...actions: FiniteTimeAction[]);
    constructor(tempArray: any) {
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
                    prev = Sequence._actionOneTwo(action1 as ActionInterval, paramArray[i] as ActionInterval);
                }
            }
            this.initWithTwoActions(prev, paramArray[last]);
        }
    }

    public initWithTwoActions(actionOne: any, actionTwo: any): boolean {
        if (!actionOne || !actionTwo) {
            return false;
        }

        let durationOne = actionOne._duration;
        let durationTwo = actionTwo._duration;
        durationOne *= actionOne._repeatMethod ? actionOne._timesForRepeat : 1;
        durationTwo *= actionTwo._repeatMethod ? actionTwo._timesForRepeat : 1;
        const d = durationOne + durationTwo;
        this.initWithDuration(d as number);

        this._actions[0] = actionOne;
        this._actions[1] = actionTwo;
        return true;
    }

    public clone(): any {
        const action = new Sequence();
        this.cloneDecoration(action as ActionInterval);
        action.initWithTwoActions(this._actions[0].clone(), this._actions[1].clone());
        return action as any;
    }

    public startWithTarget(target: any): void {
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._split = this._actions[0]._duration / this._duration;
        this._split *= this._actions[0]._repeatMethod ? this._actions[0]._timesForRepeat : 1;
        this._last = -1;
    }

    public stop(): void {
        // Issue #1305
        if (this._last !== -1) this._actions[this._last].stop();
        Action.prototype.stop.call(this);
    }

    public update(dt: number): void {
        let new_t: number;
        let found = 0;
        const locSplit = this._split;
        const locActions = this._actions;
        const locLast = this._last;
        let actionFound: ActionInterval;

        dt = this.computeEaseTime(dt);
        if (dt < locSplit) {
            // action[0]
            new_t = locSplit !== 0 ? dt / locSplit : 1;

            if (found === 0 && locLast === 1 && this._reversed) {
                // Reverse mode ?
                // XXX: Bug. this case doesn't contemplate when _last==-1, found=0 and in "reverse mode"
                // since it will require a hack to know if an action is on reverse mode or not.
                // "step" should be overriden, and the "reverseMode" value propagated to inner Sequences.
                locActions[1].update(0);
                locActions[1].stop();
            }
        } else {
            // action[1]
            found = 1;
            new_t = locSplit === 1 ? 1 : (dt - locSplit) / (1 - locSplit);

            if (locLast === -1) {
                // action[0] was skipped, execute it.
                locActions[0].startWithTarget(this.target);
                locActions[0].update(1);
                locActions[0].stop();
            }
            if (locLast === 0) {
                // switching to action 1. stop action 0.
                locActions[0].update(1);
                locActions[0].stop();
            }
        }

        // eslint-disable-next-line prefer-const
        actionFound = locActions[found];
        // Last action found and it is done.
        if (locLast === found && actionFound.isDone()) return;

        // Last action not found
        if (locLast !== found) actionFound.startWithTarget(this.target);

        new_t *= actionFound._timesForRepeat;
        actionFound.update(new_t > 1 ? new_t % 1 : new_t);
        this._last = found;
    }

    public reverse(): any {
        const action = Sequence._actionOneTwo(this._actions[1].reverse(), this._actions[0].reverse());
        this.cloneDecoration(action);
        this.reverseEaseList(action);
        action._reversed = true;
        return action as any;
    }
}

export function sequence(/* Multiple Arguments */ tempArray: any): ActionInterval {
    const paramArray = tempArray instanceof Array ? tempArray : arguments;
    if (paramArray.length === 1) {
        return paramArray[0] as ActionInterval;
    }
    const last = paramArray.length - 1;

    let result: any = null;
    if (last >= 0) {
        result = paramArray[0];
        for (let i = 1; i <= last; i++) {
            if (paramArray[i]) {
                result = Sequence._actionOneTwo(result as ActionInterval, paramArray[i] as ActionInterval);
            }
        }
    }

    return result as ActionInterval;
}
