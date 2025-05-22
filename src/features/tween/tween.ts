import { TweenSystem } from './tween-system';
import { TweenAction } from './tween-action';
import { SetAction } from './set-action';
import { ConstructorType, ITweenOption } from './data';
import {
    Action,
    FiniteTimeAction,
    ActionInterval,
    CallFunc,
    DelayTime,
    Repeat,
    RepeatForever,
    ReverseTime,
    sequence,
    spawn,
} from './action-manager';

export class Tween<T> {
    public set tag(value: number) {
        this._tag = value;
    }

    private _actions: Action[] = [];
    private _finalAction: Action | null = null;
    private _target: T | null = null;
    private _tag: number = -1;

    constructor(target?: T | null) {
        this._target = target === undefined ? null : target;
    }

    public then(other: Tween<T>): Tween<T> {
        if (other instanceof Action) {
            this._actions.push(other.clone());
        } else {
            this._actions.push(other._union());
        }
        return this;
    }

    public target(target: T): Tween<T | undefined> {
        this._target = target;
        return this;
    }

    public start(): Tween<T> {
        if (!this._target) {
            console.warn('Please set target to tween first');
            return this;
        }
        if (this._finalAction) {
            TweenSystem.instance.ActionManager.removeAction(this._finalAction);
        }

        this._finalAction = this._union();
        this._finalAction.tag = this._tag;

        TweenSystem.instance.ActionManager.addAction(this._finalAction, this._target as any, false);
        return this;
    }

    public stop(): Tween<T> {
        if (this._finalAction) {
            TweenSystem.instance.ActionManager.removeAction(this._finalAction);
        }
        return this;
    }

    public clone(target: T): Tween<T> {
        const action = this._union();
        return new Tween(target).then(action.clone() as any);
    }

    public union(): Tween<T> {
        const action = this._union();
        this._actions.length = 0;
        this._actions.push(action);
        return this;
    }

    public to(duration: number, props: ConstructorType<T>, opts?: ITweenOption): Tween<T> {
        opts = opts || Object.create(null);
        (opts as any).relative = false;
        const action = new TweenAction(duration, props, opts);
        this._actions.push(action);
        return this;
    }

    public from(duration: number, props: ConstructorType<T>, opts?: ITweenOption): Tween<T> {
        opts = opts || Object.create(null);
        (opts as any).relative = true;
        const action = new TweenAction(duration, props, opts);
        this._actions.push(action);
        return this;
    }

    public set(props: ConstructorType<T>): Tween<T> {
        const action = new SetAction(props);
        this._actions.push(action);
        return this;
    }

    public delay(duration: number): Tween<T> {
        const action = new DelayTime(duration);
        this._actions.push(action);
        return this;
    }

    public call(callback: Function): Tween<T> {
        const action = new CallFunc(callback);
        this._actions.push(action);
        return this;
    }

    public sequence(...args: Tween<T>[]): Tween<T> {
        const action = Tween._wrappedSequence(...args);
        this._actions.push(action);
        return this;
    }

    public parallel(...args: Tween<T>[]): Tween<T> {
        const action = Tween._wrappedParallel(...args);
        this._actions.push(action);
        return this;
    }

    public repeat(repeatTimes: number, embedTween?: Tween<T>): Tween<T> {
        /** adapter */
        if (repeatTimes === Infinity) {
            return this.repeatForever(embedTween);
        }

        const actions = this._actions;
        let action: any;

        if (embedTween instanceof Tween) {
            action = embedTween._union();
        } else {
            action = actions.pop();
        }

        const repeatAction = new Repeat(action, repeatTimes);
        actions.push(repeatAction);
        return this;
    }

    public repeatForever(embedTween?: Tween<T>): Tween<T> {
        const actions = this._actions;
        let action: any;

        if (embedTween instanceof Tween) {
            action = embedTween._union();
        } else {
            action = actions.pop();
        }

        const repeatForeverAction = new RepeatForever(action as ActionInterval);
        actions.push(repeatForeverAction);
        return this;
    }

    public reverseTime(embedTween?: Tween<T>): Tween<T> {
        const actions = this._actions;
        let action: any;

        if (embedTween instanceof Tween) {
            action = embedTween._union();
        } else {
            action = actions.pop();
        }

        const reverseTimeAction = new ReverseTime(action as ActionInterval);
        actions.push(reverseTimeAction);
        return this;
    }

    public static stopAll(): void {
        TweenSystem.instance.ActionManager.removeAllActions();
    }

    public static stopAllByTag(tag: number, target?: object): void {
        TweenSystem.instance.ActionManager.removeAllActionsByTag(tag, target as any);
    }

    public static stopAllByTarget(target?: object): void {
        TweenSystem.instance.ActionManager.removeAllActionsFromTarget(target as any);
    }

    private _union(): Action {
        const actions = this._actions;
        let action: Action;
        if (actions.length === 1) {
            action = actions[0];
        } else {
            action = sequence(actions);
        }

        return action;
    }

    private static readonly _tmp_args: Tween<any>[] | Action[] = [];

    private static _wrappedSequence(...args: Action[] | Tween<any>[]): ActionInterval {
        const tmp_args = Tween._tmp_args;
        tmp_args.length = 0;
        for (let l = args.length, i = 0; i < l; i++) {
            const arg = (tmp_args[i] = args[i]);
            if (arg instanceof Tween) {
                tmp_args[i] = arg._union();
            }
        }

        return sequence.apply(sequence, tmp_args as any);
    }

    private static _wrappedParallel(...args: Action[] | Tween<any>[]): FiniteTimeAction {
        const tmp_args = Tween._tmp_args;
        tmp_args.length = 0;
        for (let l = args.length, i = 0; i < l; i++) {
            const arg = (tmp_args[i] = args[i]);
            if (arg instanceof Tween) {
                tmp_args[i] = arg._union();
            }
        }

        return spawn.apply(spawn, tmp_args as any);
    }
}
