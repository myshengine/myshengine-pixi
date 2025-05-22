import { Action } from './action';

export class FiniteTimeAction extends Action {
    _duration = 0;
    _timesForRepeat = 1;

    public getDuration(): number {
        return this._duration * (this._timesForRepeat || 1);
    }

    public setDuration(duration: number): void {
        this._duration = duration;
    }

    public clone(): FiniteTimeAction {
        return new FiniteTimeAction();
    }
}
