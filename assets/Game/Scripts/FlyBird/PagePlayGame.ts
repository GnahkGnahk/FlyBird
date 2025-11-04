import { _decorator, Component, Button, director } from "cc";
import { BasePage } from "./BasePage";
import { PageController, PageIndex } from "./PageController";
const { ccclass, property } = _decorator;

@ccclass("PagePlayGame")
export class PagePlayGame extends BasePage {
  @property({ type: Button })
  btnBack: Button | null = null;

  initPage(): void {
    super.initPage();

    if (this.btnBack) {
      this.btnBack.node.on(Button.EventType.CLICK, this.onClickBack, this);
    }
  }

  private onClickBack() {
    console.log("_____ Back Clicked!");

    PageController.instance.onPageChange(null, String(PageIndex.StartPage));

    if (director.isPaused()) {
      console.log("_____ Game is paused → resume now");
      director.resume();
    } else {
      console.log("_____ Game already running");
    }
    // lúc này game có thể đang pause hoặc là đang resume, tôi cần đảm bảo khi click xong là resume
  }

  protected onDestroy(): void {
    if (this.btnBack) {
      this.btnBack.node.off(Button.EventType.CLICK, this.onClickBack, this);
    }
  }
}
