import { _decorator, Component, Node, Label } from "cc";
import { GameController } from "./GameController";
const { ccclass, property } = _decorator;

@ccclass("ResultController")
export class ResultController extends Component {
  @property(Label)
  public currentScoreLabel: Label;
  @property(Label)
  public highScoreLabel: Label;
  @property(Label)
  public notiLabel: Label;
  @property(Node)
  public notiPanel: Node;

  maxScore: number = 0;
  currentScore: number = 0;

  onLoad() {}

  start() {}

  updateScore(score: number) {
    if (score == 0) {
      this.currentScore = 0;
    } else {
      this.currentScore += score;
    }
    console.log("Current Score: " + this.currentScore);
    this.currentScoreLabel.string = this.currentScore.toString();

    if (this.currentScore % GameController.instance.swapPoint == 0) {
      GameController.instance.swapDayNight();
      GameController.instance.isCustomMap =
        !GameController.instance.isCustomMap;
    }
  }

  showResult(notiText: string) {
    if (this.currentScore > this.maxScore) {
      this.maxScore = this.currentScore;
      this.highScoreLabel.string = "New high score: " + this.maxScore;
    } else {
      this.highScoreLabel.string = "High score: " + this.maxScore;
    }

    this.notiLabel.string = notiText;

    this.notiPanel.active = true;
  }

  hideResult() {
    this.notiPanel.active = false;
  }
}
