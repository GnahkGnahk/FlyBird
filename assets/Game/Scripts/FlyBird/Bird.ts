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
} from "cc";
const { ccclass, property } = _decorator;

import { GameController } from "./GameController";

@ccclass("Bird")
export class Bird extends Component {
  @property(CCFloat)
  public jumpHeight: number = 3.5;
  @property(CCFloat)
  public jumpDuration: number = 3.5;

  @property(ParticleSystem2D)
  private particleDie: ParticleSystem2D;

  public birdAnimation: Animation;
  public birdLocation: Vec3;

  public hitSomeThing: boolean = false;

  start() {
    const collider = this.getComponent(Collider2D);

    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  update(deltaTime: number) {
    //this.fall(deltaTime);
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    console.log(`Bird hit : ${otherCollider.node.name}`);
	this.particleDie.resetSystem();
    //GameController.instance.gameOver();
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
    // tăng dần tốc độ rơi theo thời gian (giả lập trọng lực)
    this.fallSpeed += this.gravity * deltaTime;

    // cập nhật vị trí mới dựa trên tốc độ hiện tại
    const pos = this.node.position.clone();
    pos.y -= this.fallSpeed * deltaTime; // rơi xuống
    this.node.setPosition(pos);
  }
}
