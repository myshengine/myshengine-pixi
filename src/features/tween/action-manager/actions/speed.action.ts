import { Action } from '../core';

export class Speed extends Action {
    protected _speed = 0;
    protected _innerAction: Action | null = null;

    constructor(action?: Action, speed = 1) {
        super();
        action && this.initWithAction(action, speed);
    }

    public getSpeed(): number {
        return this._speed;
    }

    public setSpeed(speed: number): void {
        this._speed = speed;
    }

    public initWithAction(action: Action, speed: number): boolean {
        if (!action) {
            return false;
        }

        this._innerAction = action;
        this._speed = speed;
        return true;
    }

    public clone(): Speed {
        const action = new Speed();
        action.initWithAction(this._innerAction!.clone(), this._speed);
        return action;
    }

    public startWithTarget(target: any): void {
        Action.prototype.startWithTarget.call(this, target);
        this._innerAction!.startWithTarget(target);
    }

    public stop(): void {
        this._innerAction!.stop();
        Action.prototype.stop.call(this);
    }

    public step(dt: number): void {
        this._innerAction!.step(dt * this._speed);
    }

    public isDone(): boolean {
        return this._innerAction!.isDone();
    }

    public reverse(): Speed {
        return new Speed(this._innerAction!.reverse()!, this._speed);
    }

    public setInnerAction(action: any): void {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    }

    public getInnerAction(): Action | null {
        return this._innerAction;
    }
}
