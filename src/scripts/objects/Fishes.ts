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
        new Phaser.Math.Vector2(1, 0).rotate(-60 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(45 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(-45 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(30 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(-30 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(15 * PMath.DEG_TO_RAD),
        new Phaser.Math.Vector2(1, 0).rotate(-15 * PMath.DEG_TO_RAD)
    ]
    public static readonly minSpeed: number = 0;
    public static readonly maxSpeed: number = 100;
    public static readonly lookAheadDistance: number = 100;

    private readonly raycaster: Raycaster;

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
        this.setCollidesWith(CollisionCategories.MECHANICAL_HOOK | CollisionCategories.FISH);
        this.setIgnoreGravity(true)
    }

    public update(delta: number) {
        const scaledDelta = delta / 1000;
        let acceleration: PMath.Vector2 = new PMath.Vector2(0, 0);

        if (this.isGoingToCollide()) {
            const avoidDirection: PMath.Vector2  = this.obstacleRays();
            const collisionAvoidForce = this.steerTowards(avoidDirection);
            acceleration.add(collisionAvoidForce);
        }

        this.velocity.add(acceleration.scale(scaledDelta));
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
    constructor(scene: Phaser.Scene, raycaster: Raycaster, numberOfFish: number, minSafeHeight: number) {
        // Create fish group
        this.fishes = [];
        for (let i = 0; i < numberOfFish; i++) {
            // Create the fish
            const parameters: IFishParameters = this.spawnRandomFish(scene, minSafeHeight);
            this.fishes[i] = new Fish(scene, parameters, raycaster);
        }
    }

    // Update loop - game physics based on acceleration
    update(delta: number) {
        this.fishes.forEach(fish => fish.update(delta));
    }

    // Method to create a fish moving in a random direction
    spawnRandomFish(scene: Phaser.Scene, minSafeHeight: number): IFishParameters {
        const generator: PMath.RandomDataGenerator = new PMath.RandomDataGenerator();

        // Choose a random fish to create
        const x: number = generator.integerInRange(64, scene.cameras.main.width - 64);
        const y: number = generator.integerInRange(minSafeHeight + 64, scene.cameras.main.height - 64);
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