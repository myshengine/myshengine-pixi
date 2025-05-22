import { TweenEasing } from './types';

export interface ITweenOption {
    easing?: TweenEasing | ((k: number) => number);
    progress?: (start: number, end: number, current: number, ratio: number) => number;
    onStart?: (target?: object) => void;
    onUpdate?: (target?: object, ratio?: number) => void;
    onComplete?: (target?: object) => void;
}
