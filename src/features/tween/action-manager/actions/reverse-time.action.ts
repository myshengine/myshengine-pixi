import { Action, ActionInterval } from '../core';

export class ReverseTime extends ActionInterval {
    private _other: ActionInterval | null = null;

    constructor(action?: any) {
        super();
        action && this.initWithAction(action as ActionInterval);
    }

    public initWithAction(action: ActionInterval): boolean {
        if (!action) {
            return false;
        }
        if (action === this._other) {
            return false;
        }

        if (ActionInterval.prototype.initWithDuration.call(this, action._duration)) {
            // Don't leak if action is reused
            this._other = action;
            return true;
        }
        return false;
    }

    public clone(): ReverseTime {
        const action = new ReverseTime();
        this.cloneDecoration(action);
        action.initWithAction(this._other!.clone());
        return action;
    }

    public startWithTarget(target: any): void {
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._other!.startWithTarget(target);
    }

    public update(dt: number): void {
        dt = this.computeEaseTime(dt);
        if (this._other) this._other.update(1 - dt);
    }

    public reverse(): any {
        return this._other!.clone() as any;
    }

    public stop(): void {
        this._other!.stop();
        Action.prototype.stop.call(this);
    }
}
