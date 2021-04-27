import FPSText from "../objects/FPSText";
import { gameManager } from "../objects/GameManager";
import UIGameObject from "../objects/UIGameObject";

export default class UIScene extends Phaser.Scene {
	private fpsText: FPSText;
	private uiGameObject: UIGameObject;

	constructor() {
		super({ key: "UIScene" });
	}

	create() {
		this.fpsText = new FPSText(this);
		this.uiGameObject = new UIGameObject(this, gameManager);
	}

	update(time: number, delta: number) {
		this.fpsText.update();
		this.uiGameObject.update(delta);
	}
}
