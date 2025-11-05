import {
  _decorator,
  Component,
  Node,
  CCFloat,
  math,
  view,
  Vec3,
  Sprite,
  SpriteFrame,
  director,
} from "cc";
import { GameController } from "./GameController";
const { ccclass, property } = _decorator;

export enum ItemType {
  IMMORTAL,
  SCORE,
  SLOWMOTION,
}

@ccclass("ItemController")
export class ItemController extends Component {
  @property(Node)
  public item!: Node;

  @property(SpriteFrame)
  public immortalSprite!: SpriteFrame;

  @property(SpriteFrame)
  public scoreSprite!: SpriteFrame;

  @property(SpriteFrame)
  public slowmotionSprite!: SpriteFrame;

  @property(CCFloat)
  public spawnInterval: number = 3;

  @property(CCFloat)
  public immortalDuration: number = 5;

  @property(CCFloat)
  public slowmotionDuration: number = 2;
  @property(CCFloat)
  public slowmotionTimeScale: number = 0.3;

  private timer: number = 0;
  private isActive: boolean = false;
  private currentType: ItemType = ItemType.SCORE;

  // 🔹 Trạng thái / hiệu lực của item
  //    Immortal
  public isImmortalActive: boolean = false;
  private immortalTimer: number = 0;

  public isSlowmotionActive: boolean = false;
  private slowmotionTimer: number = 0;
  private defaultTimeScale: number = 1;

  start() {
    this.item.active = false;
    this.isImmortalActive = false;
  }

  update(deltaTime: number) {
    // Nếu đang bất tử → không tăng timer spawn, chỉ đếm ngược bất tử
    if (this.isImmortalActive) {
      this.immortalTimer -= deltaTime;
      if (this.immortalTimer <= 0) {
        this.isImmortalActive = false;
        console.log("_____ Off immortal");
        GameController.instance.activeImmortalEffect(false);
      }
      return; // return to not spawn item
    }

    // Slow motion đang hoạt động
    if (this.isSlowmotionActive) {
      this.slowmotionTimer -= deltaTime;
      if (this.slowmotionTimer <= 0) {
        this.isSlowmotionActive = false;

        const scheduler = director.getScheduler();
        scheduler.setTimeScale(this.defaultTimeScale);

        console.log("_____ End Slow Motion");
      }
    }

    // to not spawn item when not start
    if (!GameController.instance.startGame) {
      return;
    }

    // if not in immortal, spawn item
    this.timer += deltaTime;

    if (!this.isActive && this.timer >= this.spawnInterval) {
      this.spawnItem();
    }

    if (this.isActive && this.item.position.x < -400) {
      this.deactivateItem();
    }
  }

  private spawnItem() {
    this.timer = 0;
    this.isActive = true;
    this.item.active = true;

    // Random item type: 0 - Immortal, 1 - Score, 2 - Slowmotion
    this.currentType = math.randomRangeInt(0, 2);

    const sprite = this.item.getComponent(Sprite);
    if (sprite) {
      switch (this.currentType) {
        case ItemType.IMMORTAL:
          sprite.spriteFrame = this.immortalSprite;
          break;
        case ItemType.SCORE:
          sprite.spriteFrame = this.scoreSprite;
          break;
        case ItemType.SLOWMOTION:
          sprite.spriteFrame = this.slowmotionSprite;
          break;
      }
    }
    // Random position spawn
    const screenH = view.getVisibleSize().height;
    const randomY = math.randomRange(-screenH / 4, screenH / 4);
    this.item.setPosition(new Vec3(400, randomY, 0));
  }

  /** Gọi khi player ăn item */
  public onItemCollected(): ItemType | null {
    if (!this.isActive) return null;

    let collectedType: ItemType = this.currentType;

    switch (this.currentType) {
      case ItemType.IMMORTAL:
        this.isImmortalActive = true;
        this.immortalTimer = this.immortalDuration;
        console.log("_____ Player on Immortal", this.immortalDuration, "giây!");
        break;

      case ItemType.SCORE:
        console.log("_____ Player +2 Score");
        break;
      case ItemType.SLOWMOTION:
        this.isSlowmotionActive = true;
        this.slowmotionTimer = this.slowmotionDuration;

        const scheduler = director.getScheduler();
        scheduler.setTimeScale(this.slowmotionTimeScale);

        console.log(`_____ On Slowmotion ${this.slowmotionDuration}s`);
        break;
    }

    this.deactivateItem();
    return collectedType;
  }

  private deactivateItem() {
    this.item.active = false;
    this.isActive = false;
    this.timer = 0;
  }

  getImmortalDuration(): number {
    return this.immortalDuration;
  }
}
