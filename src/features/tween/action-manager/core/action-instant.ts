import { Action } from './action';
import { FiniteTimeAction } from './finite-time-action';

export class ActionInstant extends FiniteTimeAction {
    public isDone(): boolean {
        return true;
    }

    public step(dt: any): void {
        this.update(1);
    }

    public update(dt: number): void {}

    public reverse(): Action {
        return this.clone();
    }

    public clone(): ActionInstant {
        return new ActionInstant();
    }
}
