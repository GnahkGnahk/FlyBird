import { _decorator, Component, Button } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UIButtonGuard")
export class UIButtonGuard extends Component {
  @property({ tooltip: "Khoảng thời gian vô hiệu hóa sau khi click (giây)" })
  disableDuration: number = 0.3;

  private _button: Button | null = null;
  private _isLocked: boolean = false;

  onLoad() {
    this._button = this.getComponent(Button);
    if (!this._button) {
      console.warn(
        `[UIButtonGuard] Node ${this.node.name} không có Button component.`
      );
    }
  }

  start() {
    // Hook vào sự kiện click của button
    if (this._button) {
      this.node.on(Button.EventType.CLICK, this._onClick, this, true);
    }
  }

  private _onClick() {
    if (this._isLocked) {
      console.log(`[UIButtonGuard] ${this.node.name} bị spam, bỏ qua click.`);
      return;
    }

    this._lockButton();
  }

  private _lockButton() {
    if (!this._button) return;
    this._isLocked = true;

    // 🔒 disable tạm thời để chặn spam
    this._button.interactable = false;

    // 🔓 tự mở lại sau khoảng thời gian disableDuration
    this.scheduleOnce(() => {
      this._isLocked = false;
      this._button!.interactable = true;
    }, this.disableDuration);
  }

  onDestroy() {
    this.node.off(Button.EventType.CLICK, this._onClick, this);
  }
}
