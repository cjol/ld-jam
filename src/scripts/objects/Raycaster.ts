export class Ray {
    private readonly physics: Phaser.Physics.Matter.MatterPhysics;
    private readonly tileBodies: Phaser.Physics.Matter.TileBody[];
    private x1: number;
    private y1: number;
    private x2: number;
    private y2: number;

    public constructor(physics: Phaser.Physics.Matter.MatterPhysics, tileBodies: Phaser.Physics.Matter.TileBody[]) {
        this.physics = physics;
        this.tileBodies = tileBodies;
    }

    public setPosition(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    public setPositionAndDirection(x: number, y: number, dirX: number, dirY: number) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + dirX;
        this.y2 = y + dirY;
    }

    public cast(): boolean {
        const results = this.physics.intersectRay(this.x1, this.y1, this.x2, this.y2, 1, this.tileBodies);
        return results.length > 0;
    }
}

export class Raycaster {
    public readonly physics: Phaser.Physics.Matter.MatterPhysics;
    public tileBodies: Phaser.Physics.Matter.TileBody[] = [];

    public constructor(physics: Phaser.Physics.Matter.MatterPhysics) {
        this.physics = physics;
    }

    public registerBodies(layer: Phaser.Tilemaps.TilemapLayer, width: number, height: number): void {
        const tiles = layer.getTilesWithin(0, 0, width, height);
        for (const tile of tiles) {
            if (!tile || !tile.physics || !(<any>tile.physics).matterBody)
                continue;

            this.tileBodies.push((<any>tile.physics).matterBody);
        }
    }

    public createRay(): Ray {
        return new Ray(this.physics, this.tileBodies);
    }
};