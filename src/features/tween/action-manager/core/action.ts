export class Action {
    public tag: number = -1;
    protected originalTarget: Object | null = null;
    protected target: Object | null = null;

    public clone(): Action {
        const action = new Action();
        action.originalTarget = null;
        action.target = null;
        return action;
    }

    public isDone(): boolean {
        return true;
    }

    public startWithTarget(target: any): void {
        this.originalTarget = target;
        this.target = target;
    }

    public stop(): void {
        this.target = null;
    }

    public step(dt: number): void {}

    public update(dt: number): void {}

    public getTarget(): Object | null {
        return this.target;
    }

    public setTarget(target: Object): void {
        this.target = target;
    }

    public getOriginalTarget(): Object | null {
        return this.originalTarget;
    }

    public setOriginalTarget(originalTarget: any): void {
        this.originalTarget = originalTarget;
    }

    public reverse(): Action | null {
        return null;
    }

    public retain(): void {}

    public release(): void {}
}
