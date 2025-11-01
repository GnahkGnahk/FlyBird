import { _decorator, Component, CCFloat, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Mover")
export class Mover extends Component {
  @property(CCFloat)
  moveSpeed: number = 200;

  update(deltaTime: number) {
    const newPos = this.node.position.add3f(-this.moveSpeed * deltaTime, 0, 0);
    this.node.setPosition(newPos);

    if (this.node.position.x < -500) {
      this.node.destroy();
    }
  }
}
