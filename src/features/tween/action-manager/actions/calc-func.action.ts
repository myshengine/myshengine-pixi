import { ActionInstant } from '../core';

export class CallFunc extends ActionInstant {
    private _selectorTarget = null;
    private _function: Function | null = null;
    private _data = null;

    constructor(selector?: Function, selectorTarget?: any, data?: any) {
        super();
        this.initWithFunction(selector, selectorTarget, data);
    }

    public initWithFunction(selector: any, selectorTarget?: any, data?: any): boolean {
        if (selector) {
            this._function = selector;
        }
        if (selectorTarget) {
            this._selectorTarget = selectorTarget;
        }
        if (data !== undefined) {
            this._data = data;
        }
        return true;
    }

    public execute(): void {
        if (this._function) {
            this._function.call(this._selectorTarget, this.target, this._data);
        }
    }

    public update(dt: any): void {
        this.execute();
    }

    public getTargetCallback(): null {
        return this._selectorTarget;
    }

    public setTargetCallback(sel: any): void {
        if (sel !== this._selectorTarget) {
            if (this._selectorTarget) {
                this._selectorTarget = null;
            }
            this._selectorTarget = sel;
        }
    }

    public clone(): CallFunc {
        const action = new CallFunc();
        action.initWithFunction(this._function, this._selectorTarget, this._data);
        return action;
    }
}
