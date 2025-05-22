import { ActionInstant } from './action-manager';

export class SetAction extends ActionInstant {
    private _props: any;

    constructor(props?: any) {
        super();
        this._props = {};
        props !== undefined && this.init(props);
    }

    public init(props: any): boolean {
        for (const name in props) {
            this._props[name] = props[name];
        }
        return true;
    }

    public update(): void {
        const props = this._props;
        const target = this.target;
        for (const name in props) {
            //@ts-ignore
            target![name] = props[name];
        }
    }

    public clone(): SetAction {
        const action = new SetAction();
        action.init(this._props);
        return action;
    }
}
