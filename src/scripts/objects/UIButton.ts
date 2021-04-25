import GameManager from "./GameManager";

export default class UIButton extends Phaser.GameObjects.Image {
	gameManager: GameManager;
	buttonKey: string;
	upgradeName: string;
	buttonText: Phaser.GameObjects.Text;

	constructor(
		scene: Phaser.Scene,
		buttonKey: string,
		buttonBackground: string,
		buttonText: string,
		upgradeName: string,
		x: number,
		y: number,
		scale: number,
		gameManager: GameManager
	) {
		// Add the image
		super(scene, x, y, buttonBackground);
		scene.add.existing(this);

		// Add text to the button
		this.buttonText = new Phaser.GameObjects.Text(scene, x, y, buttonText, {
			color: "black",
			fontSize: "18px"
		}).setOrigin(0.5);
		scene.add.existing(this.buttonText);

		this.buttonKey = buttonKey;
		this.upgradeName = upgradeName;
		this.gameManager = gameManager;

		// Make the button interactive, set the scale and set it as transparent at first
		this.setInteractive({ useHandCursor: true });
		this.setScale(scale, scale * 0.7);
		this.setAlpha(0.25);

		// Set the on click method
		this.on("pointerdown", () => this.buttonWasClicked());
		this.on("pointerover", () => this.buttonMouseover());
		this.on("pointerout", () => this.buttonMouseout());
	}

	// Run when the button is clicked
	buttonWasClicked() {
		let didUpgrade = false;
		switch (this.buttonKey) {
		// Selling buttons
		case "sell-fish-button":
			this.gameManager.sellFish();
			break;
		case "sell-ore-button":
			this.gameManager.sellOre();
			break;
		case "sell-research-button":
			this.gameManager.sellResearch();
			break;

			// Fix the sub
		case "fix-sub-button":
			this.gameManager.fixSub();
			break;

			// Open the upgrade menu
		case "upgrade-menu-button":
			this.gameManager.upgradeMenuOpen = !this.gameManager
				.upgradeMenuOpen;
			break;

			// Upgrade buttons
		case "upgrade-oxygen-button":
			didUpgrade = this.gameManager.purchaseUpgrade("tank");
			break;
		case "upgrade-cargo-capacity":
			didUpgrade = this.gameManager.purchaseUpgrade("capacity");
			break;
		case "upgrade-chain-length":
			didUpgrade = this.gameManager.purchaseUpgrade("chain");
			break;
		case "upgrade-sub-speed":
			didUpgrade = this.gameManager.purchaseUpgrade("shipSpeed");
			break;
		case "upgrade-claw-speed":
			didUpgrade = this.gameManager.purchaseUpgrade("clawSpeed");
			break;
		case "upgrade-depth-limit":
			didUpgrade = this.gameManager.purchaseUpgrade("depthLimit");
			this.gameManager.submarine.hull = this.gameManager.getUpgradeValue(
				"depthLimit"
			);
			break;

			// Main menu buttons
		case "play-button":
			// Trigger starting the game
			this.scene.events.emit("game-started");
			break;
		}
		if (didUpgrade)
			this.scene.events.emit("upgraded");
	}
	buttonMouseover() {
		if (this.buttonKey != "play-button")
			this.setAlpha(1);

	}
	buttonMouseout() {
		if (this.buttonKey != "play-button")
			this.setAlpha(0.25);

	}
}
