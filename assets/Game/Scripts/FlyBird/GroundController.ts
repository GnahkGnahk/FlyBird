import {
  _decorator,
  Component,
  Node,
  CCInteger,
  UITransform,
  Sprite,
  SpriteFrame,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("GroundController")
export class GroundController extends Component {
  @property(Node)
  public ground1!: Node;

  @property(Node)
  public ground2!: Node;

  @property(CCInteger)
  moveSpeed: number = 200;

  @property(SpriteFrame)
  public groundSprite1: SpriteFrame | null = null;

  @property(SpriteFrame)
  public groundSprite2: SpriteFrame | null = null;

  groundWidth: number = 0;

  isDay: boolean = true;

  bgSprite1!: Sprite;
  bgSprite2!: Sprite;


  onLoad() {
    this.groundWidth = this.ground1.getComponent(UITransform).width;
    console.log("Ground Width: " + this.groundWidth);

    this.bgSprite1 = this.ground1.getComponent(Sprite);
    this.bgSprite2 = this.ground2.getComponent(Sprite);
  }

  start() {
    this.startUpGame();
  }

  startUpGame() {
    this.ground1.setPosition(0, 0, 0);
    this.ground2.setPosition(this.groundWidth, 0, 0);
  }

  update(deltaTime: number) {
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

  public swapDayNight(){
    this.isDay = !this.isDay;

    const spriteFrame = this.isDay
      ? this.groundSprite1
      : this.groundSprite2;

    this.bgSprite1.spriteFrame = spriteFrame;
    this.bgSprite2.spriteFrame = spriteFrame;
  }
}
