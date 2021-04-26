import UIButton from "./UIButton";
import GameManager from "./GameManager";

const LITTLE_BUTTON_SCALE = 0.55;

interface Button {
	label: string;
	upgrade: keyof GameManager["upgrades"];
	uiButton?: UIButton;
}

export default class UpgradeMenu {
	private readonly buttons: Button[];
	private readonly gameManager: GameManager;

	// Constructor for the upgrade menu
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		gameManager: GameManager
	) {
		this.buttons = [
			{
				label: "O2 Tank",
				upgrade: "tank"
			},
			{
				label: "Hold Size",
				upgrade: "capacity"
			},
			{
				label: "Ship Speed",
				upgrade: "shipSpeed"
			},
			{
				label: "Claw Speed",
				upgrade: "clawSpeed"
			},
			{
				label: "Hull",
				upgrade: "depthLimit"
			},
			{
				label: "Claw Length",
				upgrade: "chain"
			}
		];

		this.buttons.forEach((b, i) => {
			b.uiButton = new UIButton(
				scene,
				"little-button",
				b.label,
				x,
				y + i * 55,
				LITTLE_BUTTON_SCALE,
				() => {
					if (gameManager.purchaseUpgrade(b.upgrade)) {
						scene.events.emit("upgraded");

						if (b.upgrade === "depthLimit") {
							gameManager.submarine.hull = gameManager.getUpgradeValue(
								"depthLimit"
							);
						}
					}
				}
			);
		});

		this.gameManager = gameManager;
	}

	// Show or hide all the buttons of the upgrade menu
	public showMenu(show: boolean): void {
		// For each button, show it if show is true and we can afford it
		for (const button of this.buttons) {
			const uiButton = button.uiButton;
			if (!uiButton)
				continue;

			// Are we showing the upgrade menu?
			if (!show) {
				uiButton.hide();
				continue;
			}

			uiButton.show();
			uiButton.disable();

			// Check what the next upgrade is
			const upgradeData = this.gameManager.upgrades[button.upgrade];
			// First check whether there's an upgrade to be bought
			if (
				upgradeData.upgradesBought >=
				upgradeData.totalUpgrades.length - 1
			)
				continue;

			// If there is an upgrade, check how much it costs
			const upgradeCost =
				upgradeData.price[upgradeData.upgradesBought + 1];

			uiButton.setText(`${button.label} (${upgradeCost})`);

			// If we can afford it and it exists, we can show the button
			if (upgradeCost > this.gameManager.currentWealth)
				continue;

			uiButton.enable();
		}
	}
}
