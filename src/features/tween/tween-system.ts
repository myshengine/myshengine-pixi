import { ActionManager } from './action-manager';

export class TweenSystem {
    private static _instance: TweenSystem | null = null;

    public static get instance(): TweenSystem {
        if (!this._instance) this._instance = new TweenSystem();

        return this._instance;
    }

    public get ActionManager(): ActionManager {
        return this.actionMgr;
    }

    private readonly actionMgr = new ActionManager();

    public update(dt: number): void {
        this.actionMgr.update(dt);
    }
}
