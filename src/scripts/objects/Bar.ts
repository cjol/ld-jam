
interface BarConfig {
    color: number;
    lowColor: number;
    lowThreshold: number;
    width: number;
    height: number
}
const defaultConfig: BarConfig = {
    width: 80, height: 16,
    lowColor: 0xff0000,
    color: 0x0088ff,
    lowThreshold: 0.3

}
const BAR_WIDTH = 80, BAR_HEIGHT = 16;
export class Bar extends Phaser.GameObjects.Graphics{
    x: number;
    y: number;
    value: number;
    maxValue: number;
    config: BarConfig;

    constructor (scene: Phaser.Scene, x: number, y: number, maxValue: number, value = maxValue, config: BarConfig = defaultConfig)
    {
        super(scene);
        this.x = x;
        this.y = y;
        this.maxValue = maxValue;
        this.value = value;
        scene.add.existing(this);
        this.config = config;
    }

    update (x: number, y:number, value: number, maxValue?: number) {
        if (maxValue) this.maxValue = maxValue;
        this.value = value;
        this.x = x;
        this.y = y;
        this.clear();

        //  BG
        this.fillStyle(0x000000);
        this.fillRect(-this.config.width/2, 0, this.config.width, this.config.height);

        //  Health
        this.fillStyle(0xffffff);
        this.fillRect(-this.config.width/2 + 2, 0 + 2, this.config.width - 4, this.config.height - 4);
        const percent = this.value / this.maxValue
        if (percent < this.config.lowThreshold) {
            this.fillStyle(this.config.lowColor);
        } else {
            this.fillStyle(this.config.color);
        }

        var d = Math.floor(percent * (this.config.width - 4));

        this.fillRect(-this.config.width/2 + 2, 0 + 2, d, this.config.height - 4);
    }

}