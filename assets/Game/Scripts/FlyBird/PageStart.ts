import { _decorator, Component, Node, Button, director } from "cc";
import { BasePage } from "./BasePage";
import { PageController, PageIndex } from "./PageController";
const { ccclass, property } = _decorator;

@ccclass("PageStart")
export class PageStart extends BasePage {
  @property({ type: Button })
  btnPlayGame: Button | null = null;

  @property({ type: Button })
  btnExitGame: Button | null = null;

  initPage(): void {
    super.initPage();

    if (this.btnPlayGame) {
      this.btnPlayGame.node.on(
        Button.EventType.CLICK,
        this.onClickPlayGame,
        this
      );
    }

    if (this.btnExitGame) {
      this.btnExitGame.node.on(
        Button.EventType.CLICK,
        this.onClickExitGame,
        this
      );
    }
  }

  private onClickPlayGame() {
    console.log("_____ Play Game Clicked!");    
    // page swap
    PageController.instance.onPageChange(null, PageIndex.PagePlayGame);
  }

  private onClickExitGame() {
    console.log("_____ Exit Game Clicked!");
    if (window.confirm("Sure exit?")) {
      console.log("_____ Exit game...");
      director.end();
    }
  }

  protected onDestroy(): void {
    if (this.btnPlayGame) {
      this.btnPlayGame.node.off(
        Button.EventType.CLICK,
        this.onClickPlayGame,
        this
      );
    }

    if (this.btnExitGame) {
      this.btnExitGame.node.off(
        Button.EventType.CLICK,
        this.onClickExitGame,
        this
      );
    }
  }
}
