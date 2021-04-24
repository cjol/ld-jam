import { Math as PMath } from "phaser";
import { CollisionCategories } from "./CollisionCategories";
import { Raycaster } from "./Raycaster";

interface IFishParameters {
    type: number;
    worth: number;
    weight: number;
    position: Phaser.Math.Vector2;
    directionAngle: number;
    direction: Phaser.Math.Vector2;
    speed: number;
    scale: number;
}

export class Fish extends Phaser.Physics.Matter.Image {
    private static readonly directions: Phaser.Math.Vector2[] = [
        new Phaser.Math.Vector2(1, 0).rotate(60 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(45 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(30 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(15 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(-15 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(-30 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(-45 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(-60 * PMath.DEG_TO_RAD)
    ]
    public static readonly minSpeed: number = 0;
    public static readonly maxSpeed: number = 100;
    public static readonly lookAheadDistance: number = 100;

    private readonly raycaster: Raycaster;
    private readonly debugLines: Phaser.GameObjects.Line[];
    private readonly text: Phaser.GameObjects.Text;

    worth: number;
    weight: number;
    velocity: PMath.Vector2;
    forward: PMath.Vector2;

    // Constructor for a fish
    constructor(scene: Phaser.Scene, parameters: IFishParameters, raycaster: Raycaster) {
        // Create fish
        super(scene.matter.world, 0, 0, 'fish' + parameters.type, undefined, {
            frictionAir: 0,
            mass: 0.001
        });

        this.raycaster = raycaster;

        this.x = parameters.position.x;
        this.y = parameters.position.y;
        this.displayWidth = this.width * parameters.scale;
        this.displayHeight = this.height * parameters.scale;
        this.velocity = parameters.direction
            .clone()
            .scale(parameters.speed);
        this.forward = parameters.direction;
        this.setRotationAngle(parameters.directionAngle);

        this.worth = parameters.worth;
        this.weight = parameters.weight;
        scene.add.existing(this);

        this.setCollisionCategory(CollisionCategories.FISH);
        this.setCollidesWith(CollisionCategories.MECHANICAL_HOOK);

        // this.debugLines = [];
        // this.debugLines.push(scene.add.line(this.x, this.y, 0, 0, this.velocity.x, this.velocity.y, 0xff0000));
        // this.debugLines[0].setOrigin(0, 0);
        // for (let i = 0; i < Fish.directions.length; i++) {
        //     this.debugLines.push(scene.add
        //         .line(this.x, this.y, 0, 0, this.velocity.x, this.velocity.y, 0x00ff00)
        //         .setOrigin(0, 0));
        // }

        // this.text = scene.add.text(10, 100, 'Fish 1', { font: '16px Courier', color: 'red' });
    }

    public update(delta: number) {
        const scaledDelta = delta / 1000;
        let acceleration: PMath.Vector2 = new PMath.Vector2(0, 0);

        if (this.isGoingToCollide()) {
            const avoidDirection: PMath.Vector2  = this.obstacleRays();
            const collisionAvoidForce = this.steerTowards(avoidDirection); // * settings.avoidCollisionWeight;
            acceleration.add(collisionAvoidForce);
        }

        this.velocity.add(acceleration);
        let speed: number = this.velocity.length();
        let direction = this.velocity.scale(1 / speed);
        speed = PMath.Clamp(speed, Fish.minSpeed, Fish.maxSpeed);
        this.velocity = direction
            .clone()
            .scale(speed);

        const timeVelocity: PMath.Vector2 = this.velocity
            .clone()
            .scale(scaledDelta);
        this.x += timeVelocity.x;
        this.y += timeVelocity.y;
        this.setRotationAngle(direction.angle());
        this.forward = direction;

        // for (const debugLine of this.debugLines) {
        //     debugLine.x = this.x;
        //     debugLine.y = this.y;
        // }
        // this.debugLines[0].setTo(0, 0, this.forward.x * Fish.lookAheadDistance, this.forward.y * Fish.lookAheadDistance);

        // for (let i = 0; i < Fish.directions.length; i++) {
        //     const point: PMath.Vector2 = Fish.directions[i]
        //         .clone()
        //         .rotate(this.rotation);
        //     this.debugLines[i + 1].setTo(0, 0, point.x * Fish.lookAheadDistance, point.y * Fish.lookAheadDistance);
        // }

        // this.text.setText([
        //     'Fish 1',
        //     `x: ${this.x}`,
        //     `y: ${this.y}`,
        //     `velocity: ${this.velocity.x}, ${this.velocity.y}`,
        //     `forward: ${this.forward.x}, ${this.forward.y}`,
        //     `acceleration: ${acceleration.x}, ${acceleration.y}`
        // ]);
    }

    private setRotationAngle(angle: number): void {
        if (angle >= 0)
            this.setFlipX(true);
        this.rotation = angle;
    }

    private isGoingToCollide(): boolean {
        const ray = this.raycaster.createRay();
        const forwardRay = this.forward
            .clone()
            .scale(Fish.lookAheadDistance)
        ray.setPositionAndDirection(this.x, this.y, forwardRay.x, forwardRay.y);
        return ray.cast();
    }

    private obstacleRays(): PMath.Vector2 {
        for (const direction of Fish.directions) {
            const rotatedDirection: PMath.Vector2 = direction
                .clone()
                .rotate(this.rotation);
            const scaledDirection: PMath.Vector2 = rotatedDirection
                .clone()
                .scale(Fish.lookAheadDistance);
            const ray = this.raycaster.createRay();
            ray.setPositionAndDirection(this.x, this.y, scaledDirection.x, scaledDirection.y);

            if (!ray.cast())
                return rotatedDirection;
        }

        return this.forward;
    }

    private steerTowards(direction: PMath.Vector2): PMath.Vector2 {
        const v = direction
            .clone()
            .normalize()
            .scale(Fish.maxSpeed)
            .subtract(this.velocity);
        return this.clampMagnitude(v, 1000);
    }

    private clampMagnitude(vector: PMath.Vector2, max: number): PMath.Vector2 {
        let length: number = vector.length();
        let direction = vector
            .clone()
            .scale(1 / length);
        length = PMath.Clamp(length, 0, max);
        return direction.scale(length);
    }
}

export class FishGroup {
    fishes: Fish[];

    // Constructor for a fish
    constructor(scene: Phaser.Scene, num: number, raycaster: Raycaster) {
        // Create fish group
        this.fishes = [];
        for (let i = 0; i<num; i++) {

            // Create the fish
            const parameters: IFishParameters = this.spawnRandomFish(scene);
            this.fishes[i] = new Fish(scene, parameters, raycaster);
        }
    }

    // Update loop - game physics based on acceleration
    update(delta: number) {
        this.fishes.forEach(fish => fish.update(delta));
    }

    // Method to create a fish moving in a random direction
    spawnRandomFish(scene: Phaser.Scene): IFishParameters {
        const generator: PMath.RandomDataGenerator = new PMath.RandomDataGenerator();

        // Choose a random fish to create
        const x: number = generator.integerInRange(64, scene.cameras.main.width - 64);
        const y: number = generator.integerInRange(64, scene.cameras.main.height - 64);
        const speed: number = generator.integerInRange(Fish.maxSpeed / 2, Fish.maxSpeed);
        const worth: number = generator.integerInRange(0, 10000);
        const type: number = generator.integerInRange(1, 3);
        const directionAngle: number = generator.rotation();
        const directionX = Math.cos(directionAngle);
        const directionY = Math.sin(directionAngle);
        const scale = generator.realInRange(0.25, 1);
        const weight: number = 20 * scale;

        return {
            type: type,
            worth: worth,
            weight: weight,
            position: new Phaser.Math.Vector2(x, y),
            directionAngle: directionAngle,
            direction: new Phaser.Math.Vector2(directionX, directionY),
            speed: speed,
            scale: scale
        };
    }
}