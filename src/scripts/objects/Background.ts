import { Math } from "phaser";
import { Raycaster } from "./Raycaster";

export default class Background extends Phaser.GameObjects.GameObject {
    private readonly BACKGROUND_COLOUR: number = 0x244b7e;
    private readonly graphics: Phaser.GameObjects.Graphics;
    private readonly tilemap: Phaser.Tilemaps.Tilemap;

    private width: number;
    private height: number;

    constructor(scene: Phaser.Scene, maxDepth: number, raycaster: Raycaster) {
        super(scene, 'background');

        scene.add.existing(this);
        this.graphics = scene.add.graphics();

        this.width = scene.cameras.main.width;
        this.height = maxDepth;

        const size: number = 64;
        const numberOfColumns = Math.CeilTo(this.width / size);
        const overshootX = Math.CeilTo(((numberOfColumns * size) - this.width) / 2);
        const row: number[] = [1];
        for (let i = 0; i < numberOfColumns - 2; i++)
            row.push(0);
        row.push(1);

        const air: number[] = [];
        for (let i = 0; i < numberOfColumns ; i++)
            air.push(0);

        const toprow: number[] = [];
        for (let i = 0; i < numberOfColumns ; i++)
            toprow.push(2);

        const level: number[][] = [air, air, toprow];
        const numberOfRows = Math.FloorTo(this.height / size) + 1;
        for (let i = 0; i < numberOfRows; i++)
            level.push(row.slice());

        this.tilemap = scene.make.tilemap({ data: level, tileWidth: size, tileHeight: size, insertNull: false });
        this.tilemap.addTilesetImage('background-tiles', undefined, 256, 256);
        const layer = this.tilemap.createLayer(0, 'background-tiles', -overshootX, 0);
        layer.setCollisionByExclusion([0, 2]);
        scene.matter.world.convertTilemapLayer(layer);

        for (let i = 0; i < numberOfRows; i++)
            this.tilemap.getTileAt(0, i).setFlip(true, false);

        raycaster.registerBodies(layer, numberOfColumns, numberOfRows);
    }

    public draw(): void {
        this.graphics.clear();

        this.graphics.fillGradientStyle(this.BACKGROUND_COLOUR, this.BACKGROUND_COLOUR, 0x000001, 0x000001);
        this.graphics.fillRect(0, 0, this.width, this.height);
    }
}