import { _decorator, Component, Node, tween, UITransform, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BasePage")
export class BasePage extends Component {
  public _UITransform!: UITransform;
  public _initPosition!: Vec3;

  start(): void {
    this.initPage();
  }

  initPage() {
    this._UITransform = this.node.getComponent(UITransform)!;
  }
}
