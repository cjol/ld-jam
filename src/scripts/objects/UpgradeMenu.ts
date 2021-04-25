import UIButton from "./UIButton";
import GameManager from "./GameManager";

export default class UpgradeMenu {
	buttons: UIButton[];
	gameManager: GameManager;

	// Constructor for the upgrade menu
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		gameManager: GameManager
	) {
		this.buttons = [];
		// List of buttons to add
		this.buttons.push(
			new UIButton(
				scene,
				"upgrade-oxygen-button",
				"O2 Tank",
				"tank",
				x,
				y,
				gameManager
			)
		);
		this.buttons.push(
			new UIButton(
				scene,
				"upgrade-cargo-capacity",
				"Hold Size",
				"capacity",
				x,
				y + 50,
				gameManager
			)
		);
		this.buttons.push(
			new UIButton(
				scene,
				"upgrade-sub-speed",
				"Ship Speed",
				"shipSpeed",
				x,
				y + 100,
				gameManager
			)
		);
		this.buttons.push(
			new UIButton(
				scene,
				"upgrade-claw-speed",
				"Claw Speed",
				"clawSpeed",
				x,
				y + 150,
				gameManager
			)
		);
		this.buttons.push(
			new UIButton(
				scene,
				"upgrade-depth-limit",
				"Pressure Limit",
				"depthLimit",
				x,
				y + 200,
				gameManager
			)
		);
		this.buttons.push(
			new UIButton(
				scene,
				"upgrade-chain-length",
				"Arm Segments",
				"chain",
				x,
				y + 250,
				gameManager
			)
		);

		this.gameManager = gameManager;
	}

	// Show or hide all the buttons of the upgrade menu
	showMenu(show: boolean) {
		// For each button, show it if show is true and we can afford it
		for (let b of this.buttons) {
			b.visible = false;
			b.buttonText.visible = false;

			// Are we showing the upgrade menu?
			if (show) {
				// Check what the next upgrade is
				var upgradeData = this.gameManager.upgrades[b.upgradeName];
				// First check whether there's an upgrade to be bought
				if (
					upgradeData.upgradesBought <
					upgradeData.totalUpgrades.length - 1
				) {
					// If there is an upgrade, check how much it costs
					var upgradeCost =
						upgradeData.price[upgradeData.upgradesBought + 1];
					// If we can afford it and it exists, we can show the button
					if (upgradeCost <= this.gameManager.currentWealth) {
						b.visible = true;
						b.buttonText.visible = true;
					}
				}
			}
		}
	}
}
