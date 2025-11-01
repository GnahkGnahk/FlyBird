import {
  _decorator,
  Component,
  Node,
  CCInteger,
  systemEvent,
  SystemEvent,
  EventKeyboard,
  macro,
  director,
  Prefab,
  instantiate,
  Vec3,
  view,
} from "cc";
const { ccclass, property } = _decorator;

import { SingletonBase } from "./SingletonBase";
import { GroundController } from "./GroundController";
import { ResultController } from "./ResultController";
import { Bird } from "./Bird";

@ccclass("GameController")
export class GameController extends SingletonBase<GameController> {
  @property(GroundController)
  public groundController: GroundController;
  @property(ResultController)
  public resultController: ResultController;
  @property(Bird)
  public bird: Bird;

  @property(Node)
  public pineHolder: Node;
  @property(Prefab)
  public pinePrefab: Prefab = null!;
  @property(CCInteger)
  public spawnInterval: number = 1;
  private spawnTimer: number = 0;

  @property(CCInteger)
  pineSpeed: number = 200;

  //    DIFFICULT {
  @property({
    type: CCInteger,
    tooltip: "Gap of top and bottom Pine",
  })
  public difficult_gapPines: number = 1;
  @property({
    type: CCInteger,
    tooltip: "Speed of each pair top and bottom pine from right to left",
  })
  public difficult_pineMoveSpeed: number = 2;
  @property({
    type: CCInteger,
    tooltip: "Time to spawn each pair Pines",
  })
  public difficult_spawnPineInterval: number = 0.1;
  public minInterval = 0.5;
  //    } DIFFICULT

  start() {
    this.initListener();
    this.resultController.hideResult();
  }

  initListener() {
    systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case macro.KEY.g: // Game Over
        this.gameOver();
        break;

      case macro.KEY.p: // Add score
        this.resultController.updateScore(1);
        break;

      case macro.KEY.r: // Reset score
        console.log("Reset game");
        this.resultController.hideResult();
        this.resultController.updateScore(0);
        director.resume();
        this.bird.resetBird();
        this.pineHolder.destroyAllChildren();
        break;
      case macro.KEY.f: // Bird fly
        console.log("Bird Fly!");
        this.bird.fly();
        break;
    }
  }

  gameOver() {
    console.log("Game Over!");
    this.resultController.showResult("Game Over");
    director.pause();
  }

  update(deltaTime: number) {
    this.spawnTimer += deltaTime;

    const currentScore = this.resultController.currentScore;
    const newInterval = Math.max(
      this.minInterval,
      1 - currentScore * this.difficult_spawnPineInterval
    );
    this.spawnInterval = newInterval;

    // Spawn pine
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnPine();
    }
  }

  spawnPine() {
    if (!this.pinePrefab) {
      console.warn("Pine prefab is not assigned!");
      return;
    }

    //console.log("Spawn Pine!");
    const newPine = instantiate(this.pinePrefab);

    const screenWidth = view.getVisibleSize().width;
    //console.log("Screen Width: " + screenWidth);

    newPine.setPosition(new Vec3(400, 0, 0));
    this.pineHolder.addChild(newPine);
  }
}
