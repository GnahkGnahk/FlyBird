import {
  _decorator,
  Component,
  Node,
  CCFloat,
  Vec3,
  Animation,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  ParticleSystem2D,
  AnimationState,
  Layers,
} from "cc";
const { ccclass, property } = _decorator;

import { GameController } from "./GameController";
import { Utils } from "./Utils";

const LAYER_PLAYER = 1 << 0; // Player  // 1
const LAYER_OBSTACLE = 1 << 1; // Obstacle  // 2
const LAYER_ITEM = 1 << 2; // Item  //  4

@ccclass("Bird")
export class Bird extends Component {
  @property(CCFloat)
  public jumpHeight: number = 3.5;
  @property(CCFloat)
  public jumpDuration: number = 3.5;

  @property(ParticleSystem2D)
  private particleDie!: ParticleSystem2D;

  public birdAnimation!: Animation;

  @property(Animation)
  public explosiveAnimation!: Animation;
  public birdLocation!: Vec3;

  public hitSomeThing: boolean = false;

  gameControllerIns!: GameController;

  start() {
    this.gameControllerIns = GameController.instance;
    const collider = this.getComponent(Collider2D);

    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    if (this.explosiveAnimation) {
      this.explosiveAnimation.on(
        Animation.EventType.FINISHED,
        this.onAnimationFinished,
        this
      );
    }

    this.runCoroutine(0.5);

    this.particleDie.duration = this.gameControllerIns.getImmortalDuration();
  }

  update(deltaTime: number) {
    if (!this.gameControllerIns.startGame) {
      return;
    }
    this.fall(deltaTime);
  }

  onAnimationFinished(type: string, state: AnimationState) {
    //console.log(`____🎬 Animation "${state.name}" FINISHED`);

    this.gameControllerIns.gameOver();
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    const otherNode = otherCollider.node;
    const otherLayer = otherNode.layer;

    if (
      otherLayer === LAYER_OBSTACLE &&
      !this.gameControllerIns.isImmortalActive
    ) {
      console.log("_____ Hit obstacle!");
      this.explosiveAnimation.play();
    } else if (otherLayer === LAYER_ITEM) {
      console.log("_____ Hit item!");
      this.gameControllerIns.hitItem();
    }
  }

  onLoad() {
    this.resetBird();
    this.birdAnimation = this.getComponent(Animation);
  }

  resetBird() {
    this.birdLocation = new Vec3(0, 0, 0);
    this.node.setPosition(this.birdLocation);
    this.hitSomeThing = false;
    this.fallSpeed = 0;

  }

  fly() {
    if (!(this.fallSpeed < -800)) this.fallSpeed = -500;

    this.birdAnimation.play();
  }

  private fallSpeed: number = 0; // tốc độ rơi hiện tại
  private gravity: number = 1000; // tốc độ rơi tăng dần mỗi giây

  fall(deltaTime: number) {
    if (this.fallSpeed < -1) {
      this.node.setRotationFromEuler(0, 0, 10); //  up
    } else if (this.fallSpeed > 1) {
      this.node.setRotationFromEuler(0, 0, -20); // down
    } else {
      this.node.setRotationFromEuler(0, 0, 0); //  balance
    }

    // tăng dần tốc độ rơi theo thời gian (giả lập trọng lực)
    this.fallSpeed += this.gravity * deltaTime;

    // cập nhật vị trí mới dựa trên tốc độ hiện tại
    const pos = this.node.position.clone();
    pos.y -= this.fallSpeed * deltaTime; // rơi xuống
    this.node.setPosition(pos);
  }

  async runCoroutine(time: number = 1) {
    while (!this.gameControllerIns.startGame) {
      await Utils.wait(time);
      this.birdAnimation.play();
    }
  }

  public activeImmortalEffect(isActive: boolean) {
    if (!this.particleDie) return;

    if (isActive) {
      this.particleDie.resetSystem();
    } else {
      this.particleDie.stopSystem();
    }
  }
}
