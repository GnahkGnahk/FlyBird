import { _decorator, Component, Vec3, tween, CCFloat } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CameraShake")
export class CameraShake extends Component {
  @property({ type: CCFloat, tooltip: "Default Intensity Shaking camera" })
  public defaultIntensity: number = 10;

  @property({ type: CCFloat, tooltip: "Default duration shaking camera" })
  public defaultDuration: number = 0.3;

  private originalPos: Vec3 = new Vec3();
  private isShaking: boolean = false;

  onLoad() {
    this.originalPos = this.node.position.clone();
  }

  /**
   * Shake camera
   * @param duration (optional) duration shake
   * @param intensity (optional) intensity shake
   */
  public shake(duration?: number, intensity?: number) {
    //  if shaking , skip
    if (this.isShaking) return;
    this.isShaking = true;

    const useDuration = duration ?? this.defaultDuration;
    const useIntensity = intensity ?? this.defaultIntensity;

    const shakeTimes = Math.floor(useDuration / 0.02);
    let sequence = tween(this.node);

    for (let i = 0; i < shakeTimes; i++) {
      const offset = new Vec3(
        (Math.random() - 0.5) * useIntensity,
        (Math.random() - 0.5) * useIntensity,
        0
      );

      sequence = sequence
        .to(0.02, { position: this.originalPos.clone().add(offset) })
        .to(0.02, { position: this.originalPos });
    }

    sequence.call(() => {
      this.isShaking = false;
      this.node.setPosition(this.originalPos); // make sure original position
    });

    sequence.start();
  }
}
