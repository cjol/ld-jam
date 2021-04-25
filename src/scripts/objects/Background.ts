import { Math } from "phaser";
import { CollisionCategories } from "./CollisionCategories";

export default class Background extends Phaser.GameObjects.GameObject {
	private readonly SKY_COLOUR: number = 0xabdfe4;
	private readonly SKY_HEIGHT: number = 180;
	private readonly BACKGROUND_COLOUR: number = 0x254c7e;
	private readonly graphics: Phaser.GameObjects.Graphics;
	private readonly tilemap: Phaser.Tilemaps.Tilemap;

	public readonly SafeSpawnHeight: number = 0;

	private width: number;
	private height: number;

	constructor(scene: Phaser.Scene, maxDepth: number) {
		super(scene, "background");

		scene.add.existing(this);
		this.graphics = scene.add.graphics();

		// Add a ship to the surface
		const surfaceVessel = new Phaser.GameObjects.Image(
			scene,
			300,
			40,
			"surface-vessel"
		);
		surfaceVessel.setScale(0.15).flipX = true;
		scene.add.existing(surfaceVessel);

		this.width = scene.cameras.main.width;
		this.height = maxDepth;

		const size: number = 64;
		const numberOfColumns = Math.CeilTo(this.width / size);
		const overshootX = Math.CeilTo(
			(numberOfColumns * size - this.width) / 2
		);

		const row: number[] = [1];
		const topRow: number[] = [3];
		const penultimateRow: number[] = [5];
		for (let i = 0; i < numberOfColumns - 2; i++) {
			row.push(0);
			topRow.push(0);
			penultimateRow.push(6);
		}
		row.push(1);
		topRow.push(3);
		penultimateRow.push(5);

		const air: number[] = [];
		const phantoms: number[] = [];
		const seaSurface: number[] = [];
		for (let i = 0; i < numberOfColumns; i++) {
			air.push(0);
			phantoms.push(4);
			seaSurface.push(2);
		}

		const level: number[][] = [air, air, seaSurface, phantoms, topRow];
		const flipOffset: number = level.length - 1;
		const numberOfRows =
			Math.FloorTo(this.height / size) + 1 - level.length - 2;
		for (let i = 0; i < numberOfRows; i++)
			level.push(row.slice());
		level.push(penultimateRow);
		level.push(phantoms);

		this.tilemap = scene.make.tilemap({
			data: level,
			tileWidth: size,
			tileHeight: size,
			insertNull: false
		});
		this.tilemap.addTilesetImage("background-tiles", undefined, 256, 256);
		const layer = this.tilemap.createLayer(
			0,
			"background-tiles",
			-overshootX,
			0
		);
		layer.setCollision([1, 3, 4, 5, 6]);

		scene.matter.world.convertTilemapLayer(layer);

		const flipRows = numberOfRows + 2;
		for (let i = 0; i < flipRows; i++)
			this.tilemap.getTileAt(0, i + flipOffset).setFlip(true, false);

		const tiles = layer.getTilesWithin(0, 0, numberOfColumns, numberOfRows);
		for (const tile of tiles) {
			if (!tile || !tile.physics || !(<any>tile.physics).matterBody)
				continue;

			const matterBody: Phaser.Physics.Matter.TileBody = (<any>(
				tile.physics
			)).matterBody;
			if (tile.index === 4) {
				matterBody.setCollisionCategory(
					CollisionCategories.PHANTOM_WALLS
				);
				matterBody.setCollidesWith(CollisionCategories.FISH);
			} else {
				matterBody.setCollisionCategory(CollisionCategories.WALLS);
				matterBody.setCollidesWith(
					CollisionCategories.SUBMARINE |
						CollisionCategories.MECHANICAL_HOOK
				);
			}
		}

		this.SafeSpawnHeight = flipOffset * size;
	}

	public draw(): void {
		this.graphics.clear();

		this.graphics.fillGradientStyle(
			this.BACKGROUND_COLOUR,
			this.BACKGROUND_COLOUR,
			0x000001,
			0x000001
		);
		this.graphics.fillRect(0, 0, this.width, this.height);

		this.graphics.fillStyle(this.SKY_COLOUR);
		this.graphics.fillRect(0, 0, this.width, this.SKY_HEIGHT);
	}
}
