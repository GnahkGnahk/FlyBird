
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('SingletonBase')
export class SingletonBase<T> extends Component {
    private static _instance: any = null;

    public static get instance(): any {
        if (!this._instance) {
            console.warn(`[SingletonBase] Instance of ${this.name} is not initialized yet.`);
        }
        return this._instance;
    }

    onLoad() {
        const ctor = this.constructor as any;
        if (ctor._instance) {
            console.warn(`[SingletonBase] Duplicate instance of ${ctor.name} found. Destroying this one.`);
            this.destroy();
            return;
        }
        ctor._instance = this;
    }
}
