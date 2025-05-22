import { Action } from './core';

export class HashElement {
    actions: Action[] = [];
    target: Record<string, unknown> | null = null; // ccobject
    actionIndex = 0;
    currentAction: Action | null = null; // CCAction
    paused = false;
    lock = false;
}
