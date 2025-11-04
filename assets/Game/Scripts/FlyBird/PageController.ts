import {
  _decorator,
  Component,
  instantiate,
  Layout,
  Node,
  Prefab,
  Sprite,
  tween,
  UIOpacity,
  UITransform,
  v3,
  Vec3,
  view,
  Widget,
} from "cc";
import { SingletonBase } from "./SingletonBase";

const { ccclass, property } = _decorator;

export enum PageIndex {
  StartPage = 0,
  PagePlayGame,
}

@ccclass("PageController")
export class PageController extends SingletonBase<PageController> {
  @property(Node)
  pageContainer!: Node;
  @property([Prefab])
  prefabPages: Prefab[] = [];

  private uiTransform!: UITransform;
  private currentPage!: Node;
  private targetPage: Node;

  private _currentPageIndex: number = 0;

  protected onEnable(): void {
    this.initPage();
  }

  initPage() {
    this.uiTransform = this.node.getComponent(UITransform)!;

    const page = instantiate(this.prefabPages[this._currentPageIndex]);
    page.parent = this.pageContainer;
    this.currentPage = page;
  }

  addNewPage(targetIndex: number, from: number) {
    const page = instantiate(this.prefabPages[targetIndex]);
    page.parent = this.pageContainer;
    page.setPosition(v3(-this.uiTransform.width * from));
    page.getComponent(UIOpacity)!.opacity = 1;
  }

  updatePageOpacity() {
    let currentPageOpacity = this.currentPage.getComponent(UIOpacity);
    console.log("_____ target Page: " + this.targetPage);

    let targetPageOpacity = this.targetPage.getComponent(UIOpacity);
    tween(currentPageOpacity)
      .to(0.5, { opacity: 1 }, { easing: "smooth" })
      .start();
    tween(targetPageOpacity)
      .to(0.5, { opacity: 255 }, { easing: "smooth" })
      .start();
  }

  onSlide(to: number) {
    const tweenTime = 0.5;

    const newPosition = this.pageContainer.position
      .clone()
      .add(v3(this.uiTransform.width * to));

    // Tween position song song
    tween(this.currentPage)
      .to(tweenTime, { position: newPosition }, { easing: "backOut" })
      .start();

    tween(this.targetPage)
      .to(tweenTime, { position: Vec3.ZERO }, { easing: "backIn" })
      .start();

    // Tween opacity song song
    this.updatePageOpacity();

    // Đợi tween hoàn tất rồi đổi trang
    this.scheduleOnce(() => {
      this.currentPage = this.targetPage;
      this.targetPage = null;
      this._currentPageIndex = this.pageContainer.children.indexOf(
        this.currentPage
      );

      console.log("_____ Tween end, swap page variable");
    }, tweenTime);
  }

  public onPageChange(event: any, targetPageIndex: string) {
    const indexTarget = Number(targetPageIndex);

    if (this._currentPageIndex === indexTarget) {
      console.log("_____ same index page");
      return;
    }

    const direction = Math.sign(this._currentPageIndex - indexTarget);
    // vì direction là hướng slide của current → target,
    // nên page mới sinh ra ở hướng ngược lại
    const from = -direction;

    //  check isSpawned ?
    let targetPage = this.pageContainer.children[indexTarget];

    //  if not spawned yet
    if (!targetPage) {
      console.log(`_____ Instantiate page index ${indexTarget} from ${from}`);
      this.addNewPage(indexTarget, from);
      targetPage = this.pageContainer.children[indexTarget];
    }

    this.targetPage = targetPage;

    // 🔹 Gọi hiệu ứng trượt
    this.onSlide(direction);
  }
}
