import { ActionInterval } from '../core';

export class DelayTime extends ActionInterval {
    public update(dt: any): void {}

    public reverse(): any {
        const action = new DelayTime(this._duration);
        this.cloneDecoration(action);
        this.reverseEaseList(action);
        return action as any;
    }

    public clone(): DelayTime {
        const action = new DelayTime();
        this.cloneDecoration(action);
        action.initWithDuration(this._duration);
        return action;
    }
}
