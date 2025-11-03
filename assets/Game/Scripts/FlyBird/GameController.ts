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
  JsonAsset,
  EventTouch,
} from "cc";
const { ccclass, property } = _decorator;

import { SingletonBase } from "./SingletonBase";
import { GroundController } from "./GroundController";
import { ResultController } from "./ResultController";
import { Bird } from "./Bird";
import { ObjectPool } from "./ObjectPool";
import { Pine } from "./Pine";
import { ItemController, ItemType } from "./ItemController";
import { CameraShake } from "./CameraShake";

@ccclass("GameController")
export class GameController extends SingletonBase<GameController> {
  @property(GroundController)
  public groundController!: GroundController;
  @property(ResultController)
  public resultController!: ResultController;
  @property(Bird)
  public bird!: Bird;
  @property(ItemController)
  public itemController!: ItemController;
  @property(CameraShake)
  public cameraShake!: CameraShake;

  @property(Node)
  public pineHolder!: Node;
  @property(Prefab)
  public pinePrefab: Prefab = null!;
  @property(CCInteger)
  public maxSpawnInterval: number = 5;

  public spawnInterval: number = 1;
  private spawnTimer: number = 0;

  @property(CCInteger)
  pineSpeed: number = 200;

  @property(JsonAsset)
  pineDataAsset: JsonAsset = null!;

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

  public pinePool!: ObjectPool<Pine>;

  public pineDataList: any[] = [];

  onLoad(): void {
    super.onLoad();

    this.pinePool = new ObjectPool<Pine>(() => {
      const node = instantiate(this.pinePrefab);
      return node.getComponent(Pine)!;
    }, 10);

    this.loadPineData();
  }

  start() {
    this.initListener();
    //this.resultController.hideResult();
  }

  initListener() {
    systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
  }

  private onTouchStart(event: EventTouch | null) {
    if (!this.startGame) {
      //this.resultController.hideResult();
      this.resultController.updateScore(0);
      director.resume();
      this.bird.resetBird();
      this.pineHolder.destroyAllChildren();
      this.startGame = true;
      this.isCustomMap = false;
    } else {
      this.bird.fly();
      this.startGame = true;
    }

    this.resultController.hideResult();
  }

  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      // case macro.KEY.g: // Game Over
      //   this.gameOver();
      //   break;
      // case macro.KEY.p: // Add score
      //   this.resultController.updateScore(1);
      //   break;
      case macro.KEY.r: // Reset score
        break;
      case macro.KEY.f: // Bird fly
        if (!this.startGame) {
          //this.resultController.hideResult();
          this.resultController.updateScore(0);
          director.resume();
          this.bird.resetBird();
          this.pineHolder.destroyAllChildren();
          this.startGame = true;
          this.isCustomMap = false;
        } else {
          this.bird.fly();
          this.startGame = true;
        }

        this.resultController.hideResult();
        break;
    }
  }

  loadPineData() {
    if (this.pineDataAsset && this.pineDataAsset.json) {
      this.pineDataList = this.pineDataAsset.json as any[];
    } else {
      console.warn("Pine data asset is missing or invalid!");
      this.pineDataList = [];
    }
  }

  gameOver() {
    console.log("____Game Over!");
    this.resultController.showResult("Game Over");
    this.startGame = false;
    director.pause();
  }

  public startGame: boolean = false;
  update(deltaTime: number) {
    if (!this.startGame) {
      return;
    }
    this.spawnTimer += deltaTime;

    const currentScore = this.resultController.currentScore;
    const newInterval = Math.max(
      this.minInterval,
      this.maxSpawnInterval - currentScore * this.difficult_spawnPineInterval
    );
    this.spawnInterval = newInterval;

    // Spawn pine
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnPine();
    }
  }

  count: number = 0;
  public swapPoint: number = 5;
  public isCustomMap: boolean = false;

  spawnPine() {
    if (!this.pinePrefab) {
      console.warn("____Pine prefab is not assigned!");
      return;
    }

    // Get objec from pool instead instantiate
    const pine = this.pinePool.get();

    const node = pine.node;
    node.setParent(this.pineHolder);
    node.setPosition(new Vec3(400, 0, 0));
    node.active = true;

    if (this.isCustomMap && this.pineDataList && this.pineDataList.length > 0) {
      const data = this.pineDataList[this.count];
      //console.log("_____Custom data : " + data);

      pine.setUpAll(data);
      this.count = (this.count + 1) % this.pineDataList.length;
    } else {
      pine.setUpAll();
    }
  }

  despawnPine(pine: Pine) {
    const node = pine.node;
    node.active = false;
    node.removeFromParent();
    this.pinePool.release(pine);
  }

  public swapDayNight() {
    this.groundController.swapDayNight();
  }

  public get isImmortalActive(): boolean {
    return this.itemController.isImmortalActive;
  }

  public hitItem() {
    let itemType = this.itemController.onItemCollected();
    switch (itemType) {
      case ItemType.SCORE:
        this.resultController.updateScore(2);
        break;

      case ItemType.IMMORTAL:
        this.activeImmortalEffect(true);
        break;

      default:
        console.warn("_____ Undefine item", itemType);
        break;
    }
  }

  public activeImmortalEffect(active: boolean) {
    this.bird.activeImmortalEffect(active);
  }

  public getImmortalDuration(): number {
    return this.itemController.immortalDuration;
  }
}
