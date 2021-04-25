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
		const buttons = [
			{ key: "upgrade-oxygen-button", label: "O2 Tank", upgrade: "tank" },
			{
				key: "upgrade-cargo-capacity",
				label: "Hold Size",
				upgrade: "capacity"
			},
			{
				key: "upgrade-sub-speed",
				label: "Ship Speed",
				upgrade: "shipSpeed"
			},
			{
				key: "upgrade-claw-speed",
				label: "Claw Speed",
				upgrade: "clawSpeed"
			},
			{
				key: "upgrade-depth-limit",
				label: "Hull",
				upgrade: "depthLimit"
			},
			{
				key: "upgrade-chain-length",
				label: "Claw Length",
				upgrade: "chain"
			}
		];
		this.buttons = buttons.map(
			(b, i) =>
				new UIButton(
					scene,
					b.key,
					b.label,
					b.upgrade,
					x,
					y + i * 50,
					gameManager
				)
		);

		this.gameManager = gameManager;
	}

	// Show or hide all the buttons of the upgrade menu
	showMenu(show: boolean) {
		// For each button, show it if show is true and we can afford it
		for (const b of this.buttons) {
			b.visible = false;
			b.buttonText.visible = false;

			// Are we showing the upgrade menu?
			if (show) {
				// Check what the next upgrade is
				const upgradeData = this.gameManager.upgrades[b.upgradeName];
				// First check whether there's an upgrade to be bought
				if (
					upgradeData.upgradesBought <
					upgradeData.totalUpgrades.length - 1
				) {
					// If there is an upgrade, check how much it costs
					const upgradeCost =
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
