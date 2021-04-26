export interface BarConfig {
	color: number;
	warnThreshold?: number;
	warnColor?: number;
	lowThreshold?: number;
	lowColor?: number;
	label?: string;
}

export class Bar extends Phaser.GameObjects.Graphics {
	private static readonly wiggleRadius: number = 3;

	private shakeXTween: Phaser.Tweens.Tween | null;
	private shakeYTween: Phaser.Tweens.Tween | null;
	x: number;
	y: number;
	value: number;
	maxValue: number;
	config: BarConfig;
	barWidth: number;
	barHeight: number;
	barName: string;
	barLabel: Phaser.GameObjects.Text;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		maxValue: number,
		value = maxValue,
		barWidth: number,
		barHeight: number,
		config: BarConfig
	) {
		super(scene);
		this.x = x;
		this.y = y;
		this.maxValue = maxValue;
		this.value = value;
		this.barWidth = barWidth;
		this.barHeight = barHeight;
		this.config = config;
		scene.add.existing(this);

		// Add a label to the bar
		if (this.config.label) {
			this.barLabel = new Phaser.GameObjects.Text(
				scene,
				this.x,
				this.y - 10,
				this.config.label,
				{ color: "black", fontSize: "16px" }
			).setOrigin(0.5);
			scene.add.existing(this.barLabel);
		}


	}

	update(value: number, maxValue?: number) {
		if (maxValue)
			this.maxValue = maxValue;
		this.value = value;
		this.clear();

		//  BG
		this.fillStyle(0x000000);
		this.fillRect(-this.barWidth / 2, 0, this.barWidth, this.barHeight);

		//  Health
		this.fillStyle(0xffffff);
		this.fillRect(
			-this.barWidth / 2 + 2,
			0 + 2,
			this.barWidth - 4,
			this.barHeight - 4
		);
		const percent = this.value / this.maxValue;
		if (this.config.lowThreshold && this.config.lowColor && percent < this.config.lowThreshold)
			this.fillStyle(this.config.lowColor);
		else if (this.config.warnThreshold && this.config.warnColor && percent < this.config.warnThreshold)
			this.fillStyle(this.config.warnColor);
		else
			this.fillStyle(this.config.color);

		const d = Math.floor(percent * (this.barWidth - 4));

		this.fillRect(-this.barWidth / 2 + 2, 0 + 2, d, this.barHeight - 4);
	}

	private static wiggle(progress: number, period1: number, period2: number): number {
		const current1: number = progress * Math.PI * 2 * period1;
		const current2: number = progress * (Math.PI * 2 * period2 + Math.PI / 2);

		return Math.sin(current1) * Math.cos(current2);
	}

	public shake() {
		if (this.shakeXTween)
			return;

		this.shakeXTween = this.scene.tweens.add({
			targets: this,
			x: this.x + 5,
			duration: 500,
			repeat: -1,
			ease: (progress) => Bar.wiggle(progress, 1, 2),
			delay: 0
		});
		this.shakeYTween = this.scene.tweens.add({
			targets: this,
			y: this.y + 5,
			duration: 500,
			repeat: -1,
			ease: (progress) => Bar.wiggle(progress, 4, 5),
			delay: 100
		});
	}

	public stopShake() {
		if (!this.shakeXTween || !this.shakeYTween)
			return;

		this.shakeXTween.stop(0);
		this.shakeXTween = null;
		this.shakeYTween.stop(0);
		this.shakeYTween = null;
	}
}
