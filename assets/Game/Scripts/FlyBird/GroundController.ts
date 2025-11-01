import { _decorator, Component, Node, CCInteger, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GroundController")
export class GroundController extends Component {
  @property(Node)
  public ground1: Node;

  @property(Node)
  public ground2: Node;

  @property(CCInteger)
  moveSpeed: number = 200;

  groundWidth: number = 0;

  onLoad() {
    this.groundWidth = this.ground1.getComponent(UITransform).width;
    console.log("Ground Width: " + this.groundWidth);
  }

  start() {
    this.startUpGame();
  }

  startUpGame() {
    this.ground1.setPosition(0, 0, 0);
    this.ground2.setPosition(this.groundWidth, 0, 0);
  }

  update(deltaTime: number) {
    //console.log("Ground Update");
    this.ground1.setPosition(
      this.ground1.position.x - this.moveSpeed * deltaTime,
      0,
      0
    );
    this.ground2.setPosition(
      this.ground2.position.x - this.moveSpeed * deltaTime,
      0,
      0
    );

    if (this.ground1.position.x <= -this.groundWidth) {
      this.ground1.setPosition(
        this.ground2.position.x + this.groundWidth,
        0,
        0
      );
    }
    if (this.ground2.position.x <= -this.groundWidth) {
      this.ground2.setPosition(
        this.ground1.position.x + this.groundWidth,
        0,
        0
      );
    }
  }
}
