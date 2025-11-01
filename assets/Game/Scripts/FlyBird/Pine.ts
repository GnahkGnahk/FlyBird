import { _decorator, Component, Node, CCInteger, view, math } from "cc";
const { ccclass, property } = _decorator;

import { GameController } from "./GameController";

@ccclass("Pine")
export class Pine extends Component {
  @property(Node)
  public pineTop: Node = null!;

  @property(Node)
  public pineBot: Node = null!;

  @property(CCInteger)
  moveSpeed: number = 10;

  @property(CCInteger)
  public gapHeightMax: number = 300;

  @property(CCInteger)
  public gapHeightMin: number = 100;

  public currentGap: number = 0;

  tempCurrentScore: number = 0;

  tempDifficultMoveSpeed: number = 0;
  tempDifficultGap: number = 0;

  start() {
    this.tempDifficultMoveSpeed =
      GameController.instance.difficult_pineMoveSpeed;
    this.tempDifficultGap = GameController.instance.difficult_gapPines;
    this.tempCurrentScore =
      GameController.instance.resultController.currentScore;

    this.tempDifficultGap *= this.tempCurrentScore; //  Difficult
    let tempMin = this.gapHeightMax - this.tempCurrentScore;
    if (tempMin <= this.gapHeightMin) {
      tempMin = this.gapHeightMin;
    }

    this.currentGap = tempMin;
    this.initPine();
  }

  initPine() {
    const screenHeight = view.getVisibleSize().height;
    const minY = -screenHeight / 4;

    const bottomY = math.randomRange(minY, 0);

    // Tính vị trí ống trên dựa theo khoảng gap
    const topY = bottomY + this.currentGap;

    // Cập nhật vị trí cho 2 ống
    this.pineBot.setPosition(this.pineBot.position.x, bottomY, 0);
    this.pineTop.setPosition(this.pineTop.position.x, topY, 0);

    //console.log("Pine : " + this.node.position);
  }

  added: boolean = false;
  update(deltaTime: number) {
    let tempMoveSpeed = this.moveSpeed * this.tempDifficultMoveSpeed; //  Difficult
    const newPos = this.node.position.add3f(-tempMoveSpeed * deltaTime, 0, 0);
    this.node.setPosition(newPos);
    // this.node.setPosition(this.node.position.x - this.moveSpeed * deltaTime, 0, 0);

    if (this.node.position.x <= 0.1 && !this.added) {
      this.added = true;
      GameController.instance.resultController.updateScore(1);
    }

    if (this.node.position.x <= -400) {
      // console.log("Destroy Pine:", pos);
      this.node.destroy();
    }
  }
}
