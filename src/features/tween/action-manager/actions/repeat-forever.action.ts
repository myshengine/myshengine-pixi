import { ActionInstant, ActionInterval } from '../core';

export class RepeatForever extends ActionInterval {
    private _innerAction: ActionInterval | null = null;

    constructor(action?: ActionInterval) {
        super();
        action && this.initWithAction(action);
    }

    public initWithAction(action: ActionInterval): boolean {
        if (!action) {
            return false;
        }

        this._innerAction = action;
        return true;
    }

    public clone(): RepeatForever {
        const action = new RepeatForever();
        this.cloneDecoration(action);
        action.initWithAction(this._innerAction!.clone());
        return action;
    }

    public startWithTarget(target: any): void {
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._innerAction!.startWithTarget(target);
    }

    public step(dt: any): void {
        const locInnerAction = this._innerAction!;
        locInnerAction.step(dt as number);
        if (locInnerAction.isDone()) {
            locInnerAction.startWithTarget(this.target);
            locInnerAction.step(locInnerAction.getElapsed() - locInnerAction._duration);
        }
    }

    public isDone(): boolean {
        return false;
    }

    public reverse(): any {
        const action = new RepeatForever(this._innerAction!.reverse());
        this.cloneDecoration(action);
        this.reverseEaseList(action);
        return action as any;
    }

    public setInnerAction(action: any): void {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    }

    public getInnerAction(): ActionInstant | null {
        return this._innerAction;
    }
}
