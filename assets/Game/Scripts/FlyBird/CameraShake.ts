import { _decorator, Component, Vec3, tween, CCFloat } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CameraShake")
export class CameraShake extends Component {
  @property({ type: CCFloat, tooltip: "Độ mạnh rung (pixel)" })
  public defaultIntensity: number = 10;

  @property({ type: CCFloat, tooltip: "Thời gian rung (giây)" })
  public defaultDuration: number = 0.3;

  private originalPos: Vec3 = new Vec3();
  private isShaking: boolean = false;

  onLoad() {
    this.originalPos = this.node.position.clone();
  }

  /**
   * Rung camera trong thời gian ngắn
   * @param duration (optional) thời gian rung
   * @param intensity (optional) độ mạnh rung
   */
  public shake(duration?: number, intensity?: number) {
    // Nếu đang rung thì bỏ qua để không rung chồng
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
      this.node.setPosition(this.originalPos); // đảm bảo reset vị trí
    });

    sequence.start();
  }
}
