import { Math } from "phaser";


export default class Background extends Phaser.GameObjects.GameObject {
    private readonly MAX_DEPTH: number = 100000000000;
    private readonly graphics: Phaser.GameObjects.Graphics;

    private depthBacking: number;
    private width: number;
    private height: number;

    constructor(scene: Phaser.Scene) {
        super(scene, 'background');

        scene.add.existing(this);
        this.graphics = scene.add.graphics();

        this.width = scene.cameras.main.width;
        this.height = scene.cameras.main.height;
    }

    public draw(): void {
        this.graphics.fillGradientStyle(0x244b7e, 0x244b7e, 0x244b7e, 0x244b7e);
        this.graphics.fillRect(0, 0, this.width, this.height);
    }

    public set depth(value: number)
    {
        value = Math.Clamp(value, 0, this.MAX_DEPTH);
        this.depthBacking = value;
    }

    public get depth(): number
    {
        return this.depthBacking;
    }
}