import { Action, ActionInterval } from './core';
import { HashElement } from './hash-element';

export class ActionManager {
    private _hashTargets = new Map();
    private _arrayTargets: HashElement[] = [];
    private _currentTarget!: HashElement;
    private _elementPool: HashElement[] = [];

    public addAction(action: Action, target: Object, paused: boolean): void {
        if (!action || !target) {
            return;
        }

        // check if the action target already exists
        let element = this._hashTargets.get(target);
        // if doesn't exists, create a hashelement and push in mpTargets
        if (!element) {
            element = this._getElement(target as any, paused);
            this._hashTargets.set(target, element);
            this._arrayTargets.push(element);
        } else if (!element.actions) {
            element.actions = [];
        }
        // update target due to the same UUID is allowed for different scenarios
        element.target = target;
        element.actions.push(action);
        action.startWithTarget(target);
    }

    public removeAllActions(): void {
        const locTargets = this._arrayTargets;
        for (let i = 0; i < locTargets.length; i++) {
            const element = locTargets[i];
            if (element) this._putElement(element);
        }
        this._arrayTargets.length = 0;
        this._hashTargets = new Map();
    }

    public removeAllActionsFromTarget(target: Object): void {
        // explicit null handling
        if (target == null) return;
        const element = this._hashTargets.get(target);
        if (element) {
            element.actions.length = 0;
            this._deleteHashElement(element);
        }
    }

    public removeAction(action: Action): void {
        // explicit null handling
        if (action == null) return;
        const target = action.getOriginalTarget()!;
        const element = this._hashTargets.get(target);

        if (element) {
            for (let i = 0; i < element.actions.length; i++) {
                if (element.actions[i] === action) {
                    element.actions.splice(i, 1);
                    // update actionIndex in case we are in tick. looping over the actions
                    if (element.actionIndex >= i) element.actionIndex--;
                    break;
                }
            }
        }
    }

    _removeActionByTag(tag: number, element: any, target?: Object): void {
        for (let i = 0, l = element.actions.length; i < l; ++i) {
            const action = element.actions[i];
            if (action && action.tag === tag) {
                if (target && action.getOriginalTarget() !== target) {
                    continue;
                }
                this._removeActionAtIndex(i, element);
                break;
            }
        }
    }

    _removeAllActionsByTag(tag: number, element: any, target?: Object): void {
        for (let i = element.actions.length - 1; i >= 0; --i) {
            const action = element.actions[i];
            if (action && action.tag === tag) {
                if (target && action.getOriginalTarget() !== target) {
                    continue;
                }
                this._removeActionAtIndex(i, element);
            }
        }
    }

    public removeActionByTag(tag: number, target?: Object): void {
        const hashTargets = this._hashTargets;
        if (target) {
            const element = hashTargets.get(target);
            if (element) {
                this._removeActionByTag(tag, element, target);
            }
        } else {
            hashTargets.forEach((element) => {
                this._removeActionByTag(tag, element);
            });
        }
    }

    public removeAllActionsByTag(tag: number, target?: Object): void {
        const hashTargets = this._hashTargets;
        if (target) {
            const element = hashTargets.get(target);
            if (element) {
                this._removeAllActionsByTag(tag, element, target);
            }
        } else {
            hashTargets.forEach((element) => {
                this._removeAllActionsByTag(tag, element);
            });
        }
    }

    public getActionByTag(tag: number, target: Object): Action | null {
        const element = this._hashTargets.get(target);
        if (element) {
            if (element.actions != null) {
                for (let i = 0; i < element.actions.length; ++i) {
                    const action = element.actions[i];
                    if (action && action.tag === tag) {
                        return action as Action;
                    }
                }
            }
        }
        return null;
    }

    public getNumberOfRunningActionsInTarget(target: Object): number {
        const element = this._hashTargets.get(target);
        if (element) {
            return element.actions ? (element.actions.length as number) : 0;
        }

        return 0;
    }

    public pauseTarget(target: Object): void {
        const element = this._hashTargets.get(target);
        if (element) element.paused = true;
    }

    public resumeTarget(target: Object): void {
        const element = this._hashTargets.get(target);
        if (element) element.paused = false;
    }

    public pauseAllRunningActions(): Array<any> {
        const idsWithActions: Record<string, unknown>[] = [];
        const locTargets = this._arrayTargets;
        for (let i = 0; i < locTargets.length; i++) {
            const element = locTargets[i];
            if (element && !element.paused) {
                element.paused = true;
                idsWithActions.push(element.target!);
            }
        }
        return idsWithActions;
    }

    public resumeTargets(targetsToResume: Array<any>): void {
        if (!targetsToResume) return;

        for (let i = 0; i < targetsToResume.length; i++) {
            if (targetsToResume[i]) this.resumeTarget(targetsToResume[i]);
        }
    }

    public pauseTargets(targetsToPause: Array<any>): void {
        if (!targetsToPause) return;

        for (let i = 0; i < targetsToPause.length; i++) {
            if (targetsToPause[i]) this.pauseTarget(targetsToPause[i]);
        }
    }

    private _removeActionAtIndex(index: any, element: any): void {
        const action = element.actions[index];

        element.actions.splice(index, 1);

        // update actionIndex in case we are in tick. looping over the actions
        if (element.actionIndex >= index) element.actionIndex--;

        if (element.actions.length === 0) {
            this._deleteHashElement(element);
        }
    }

    public update(dt: number): void {
        const locTargets = this._arrayTargets;
        let locCurrTarget: HashElement;
        for (let elt = 0; elt < locTargets.length; elt++) {
            this._currentTarget = locTargets[elt];
            locCurrTarget = this._currentTarget;

            if (!locCurrTarget.paused && locCurrTarget.actions) {
                locCurrTarget.lock = true;
                // The 'actions' CCMutableArray may change while inside this loop.
                for (
                    locCurrTarget.actionIndex = 0;
                    locCurrTarget.actionIndex < locCurrTarget.actions.length;
                    locCurrTarget.actionIndex++
                ) {
                    locCurrTarget.currentAction = locCurrTarget.actions[locCurrTarget.actionIndex];
                    if (!locCurrTarget.currentAction) continue;

                    // use for speed
                    locCurrTarget.currentAction.step(
                        dt *
                            (this._isActionInternal(locCurrTarget.currentAction)
                                ? locCurrTarget.currentAction.getSpeed()
                                : 1),
                    );

                    if (locCurrTarget.currentAction && locCurrTarget.currentAction.isDone()) {
                        locCurrTarget.currentAction.stop();
                        const action = locCurrTarget.currentAction;
                        // Make currentAction nil to prevent removeAction from salvaging it.
                        locCurrTarget.currentAction = null;
                        this.removeAction(action);
                    }

                    locCurrTarget.currentAction = null;
                }
                locCurrTarget.lock = false;
            }
            // only delete currentTarget if no actions were scheduled during the cycle (issue #481)
            if (locCurrTarget.actions.length === 0) {
                if (this._deleteHashElement(locCurrTarget)) {
                    elt--;
                }
            }
        }
    }

    private _getElement(target: Record<string, unknown>, paused: boolean): HashElement {
        let element = this._elementPool.pop();
        if (!element) {
            element = new HashElement();
        }
        element.target = target;
        element.paused = !!paused;
        return element;
    }

    private _putElement(element: HashElement): void {
        element.actions.length = 0;
        element.actionIndex = 0;
        element.currentAction = null;
        element.paused = false;
        element.target = null;
        element.lock = false;
        this._elementPool.push(element);
    }

    private _deleteHashElement(element: any): boolean {
        let ret = false;
        if (element && !element.lock) {
            if (this._hashTargets.get(element.target)) {
                this._hashTargets.delete(element.target);
                const targets = this._arrayTargets;
                for (let i = 0, l = targets.length; i < l; i++) {
                    if (targets[i] === element) {
                        targets.splice(i, 1);
                        break;
                    }
                }
                this._putElement(element);
                ret = true;
            }
        }
        return ret;
    }

    private _isActionInternal(action: any): action is ActionInterval {
        return typeof action._speedMethod !== 'undefined';
    }
}
