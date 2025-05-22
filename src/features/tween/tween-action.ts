import { ActionInterval } from './action-manager';
import { ITweenOption } from './data';
import { easing } from './easing';
import { tweenEasingAdapter } from './utils';

export class TweenAction extends ActionInterval {
  private _opts: any;
  private _props: any;
  private _originProps: any;

  constructor(duration: number, props: any, opts?: ITweenOption) {
    super();
    if (opts == null) {
      opts = Object.create(null);
    } else {
      /** adapter */
      if (opts.easing && typeof opts.easing === 'string') {
        opts.easing = tweenEasingAdapter(opts.easing) as any;
      }

      // global easing or progress used for this action
      if (!opts.progress) {
        opts.progress = this.progress;
      }
      if (opts.easing && typeof opts.easing === 'string') {
        const easingName = opts.easing as string;
        //@ts-ignore
        opts.easing = easing[easingName];
      }
    }
    this._opts = opts;

    this._props = Object.create(null);
    for (const name in props) {
      if (!props.hasOwnProperty(name)) continue;

      let value = props[name];

      if (typeof value === 'function') {
        value = value();
      }

      if (value == null || typeof value === 'string') continue;

      let customEasing: any;
      let progress: any;

      if (value.value !== undefined && (value.easing || value.progress)) {
        if (typeof value.easing === 'string') {
          //@ts-ignore
          customEasing = easing[value.easing];
        } else {
          customEasing = value.easing;
        }
        progress = value.progress;
        value = value.value;
      }

      const prop = Object.create(null);
      prop.value = value;
      prop.easing = customEasing;
      prop.progress = progress;
      this._props[name] = prop;
    }

    this._originProps = props;
    this.initWithDuration(duration);
  }

  public clone(): TweenAction {
    const action = new TweenAction(this._duration, this._originProps, this._opts);
    this.cloneDecoration(action);
    return action;
  }

  public startWithTarget(target: Record<string, unknown>): void {
    ActionInterval.prototype.startWithTarget.call(this, target);

    const relative = !!this._opts.relative;
    const props = this._props;
    for (const property in props) {
      const _t: any = target[property];
      if (_t === undefined) {
        continue;
      }

      const prop: any = props[property];
      const value = prop.value;
      if (typeof _t === 'number') {
        prop.start = _t;
        prop.current = _t;
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        prop.end = relative ? _t + value : value;
      } else if (typeof _t === 'object') {
        if (prop.start == null) {
          prop.start = {};
          prop.current = {};
          prop.end = {};
        }

        for (const k in value) {
          // filtering if it not a number
          // eslint-disable-next-line no-restricted-globals
          if (isNaN(_t[k])) continue;
          prop.start[k] = _t[k];
          prop.current[k] = _t[k];
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          prop.end[k] = relative ? _t[k] + value[k] : value[k];
        }
      }
    }
    if (this._opts.onStart) {
      this._opts.onStart(this.target);
    }
  }

  public update(t: number): void {
    const target = this.target;
    if (!target) return;

    const props = this._props;
    const opts = this._opts;

    let easingTime = t;
    if (opts.easing) easingTime = opts.easing(t);

    const progress = opts.progress;
    for (const name in props) {
      const prop = props[name];
      const time = prop.easing ? prop.easing(t) : easingTime;
      const interpolation = prop.progress ? prop.progress : progress;

      const start = prop.start;
      const end = prop.end;
      if (typeof start === 'number') {
        prop.current = interpolation(start, end, prop.current, time);
      } else if (typeof start === 'object') {
        for (const k in start) {
          prop.current[k] = interpolation(start[k], end[k], prop.current[k], time);
        }
      }

      //@ts-ignore
      target[name] = prop.current;
    }
    if (opts.onUpdate) {
      opts.onUpdate(this.target, t);
    }
    if (t === 1 && opts.onComplete) {
      opts.onComplete(this.target);
    }
  }

  public progress(start: number, end: number, current: number, t: number): number {
    return (current = start + (end - start) * t);
  }
}
