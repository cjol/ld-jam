interface BarConfig {
	color: number;
	lowColor: number;
	lowThreshold: number;
	width: number;
	height: number;
	label: string;
}
const healthConfig: BarConfig = {
	width: 400,
	height: 50,
	lowColor: 0xff0000,
	color: 0x00ff88,
	lowThreshold: 0.5,
	label: "Hull Integrity"
};
const oxygenConfig: BarConfig = {
	width: 400,
	height: 50,
	lowColor: 0xff0000,
	color: 0x0088ff,
	lowThreshold: 0.5,
	label: "Oxygen Remaining"
};
const cargoConfig: BarConfig = {
	width: 400,
	height: 50,
	lowColor: 0x555555,
	color: 0x555555,
	lowThreshold: 0.3,
	label: "Hold Space"
};

export class Bar extends Phaser.GameObjects.Graphics {
	x: number;
	y: number;
	value: number;
	maxValue: number;
	config: BarConfig;
	barName: string;
	barLabel: Phaser.GameObjects.Text;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		maxValue: number,
		value = maxValue,
		barName: string
	) {
		super(scene);
		this.x = x;
		this.y = y;
		this.maxValue = maxValue;
		this.value = value;
		scene.add.existing(this);
		if (barName == "oxygen")
			this.config = oxygenConfig;

		if (barName == "hull")
			this.config = healthConfig;

		if (barName == "cargo")
			this.config = cargoConfig;

		this.barName = barName;

		// Add a label to the bar
		this.barLabel = new Phaser.GameObjects.Text(
			scene,
			this.x,
			this.y - 20,
			this.config.label,
			{ color: "black", fontSize: "24px" }
		).setOrigin(0.5);
		scene.add.existing(this.barLabel);
	}

	update(value: number, maxValue?: number) {
		if (maxValue)
			this.maxValue = maxValue;
		this.value = value;
		this.clear();

		//  BG
		this.fillStyle(0x000000);
		this.fillRect(
			-this.config.width / 2,
			0,
			this.config.width,
			this.config.height
		);

		//  Health
		this.fillStyle(0xffffff);
		this.fillRect(
			-this.config.width / 2 + 2,
			0 + 2,
			this.config.width - 4,
			this.config.height - 4
		);
		const percent = this.value / this.maxValue;
		if (percent < this.config.lowThreshold)
			this.fillStyle(this.config.lowColor);
		else
			this.fillStyle(this.config.color);

		const d = Math.floor(percent * (this.config.width - 4));

		this.fillRect(
			-this.config.width / 2 + 2,
			0 + 2,
			d,
			this.config.height - 4
		);
	}
}
