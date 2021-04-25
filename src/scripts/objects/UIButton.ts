export default class UIButton extends Phaser.GameObjects.Image {
	private disabled: boolean = false;
	buttonText: Phaser.GameObjects.Text;

	constructor(
		scene: Phaser.Scene,
		buttonBackground: string,
		buttonText: string,
		x: number,
		y: number,
		scale: number,
		onClick: () => void,
		allowHover: boolean = true
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

		// Make the button interactive, set the scale and set it as transparent at first
		this.setInteractive({ useHandCursor: true })
			.setScale(scale, scale * 0.7)
			.setAlpha(0.25);

		// Set the on click method
		this.on("pointerdown", () => {
			if (!this.disabled) {
				onClick();
				this.setAlpha(0.25);
			}
		});

		if (allowHover) {
			this.on("pointerover", () => this.buttonMouseover());
			this.on("pointerout", () => this.buttonMouseout());
		}
	}

	private buttonMouseover(): void {
		if (!this.disabled)
			this.setAlpha(1);
	}

	private buttonMouseout(): void {
		if (!this.disabled)
			this.setAlpha(0.25);
	}

	public hide(): void {
		this.visible = false;
		this.buttonText.visible = false;
	}

	public show(): void {
		this.visible = true;
		this.buttonText.visible = true;
	}

	public disable(): void {
		this.setTint(0x333333);
		this.buttonText.setColor("white");
		this.disabled = true;
	}

	public enable(): void {
		this.setTint(0xffffff);
		this.buttonText.setColor("black");
		this.disabled = false;
	}
}
