import { Fish } from "./Fishes";
import { MechanicalHook } from "./MechanicalHook";
import Submarine from "./Submarine";
import {gameManager} from "./GameManager";

export default class GameWorld {
    scene: Phaser.Scene;
    submarine: Submarine;
    // Initialise the game

    constructor(scene: Phaser.Scene, submarine: Submarine) {
        // Let us access the important stuff later
        this.scene = scene;
        this.submarine = submarine;

        // start watching for interesting collisions in our world
        this.scene.matter.world.on('collisionstart', this.watchCollisions.bind(this));
    }

    watchCollisions(event: Phaser.Physics.Matter.Events.CollisionStartEvent) {
        event.pairs
            .map(detectObjs)
            .filter((x): x is MatchedPair => x !== null)
            .forEach(pair => {
                const hook = pair.hook;
                const item = pair.item;
               console.log("Caught something!", item)
                if (item instanceof Fish) {
                    gameManager.catchFish(item);
                }
            });
    }
}
type MatchedPair = { hook: MechanicalHook, item: Phaser.GameObjects.GameObject };

function detectObjs(pair: Phaser.Types.Physics.Matter.MatterCollisionData): null | MatchedPair {
    if (pair.bodyA.gameObject instanceof MechanicalHook)
        return { hook: pair.bodyA.gameObject, item: pair.bodyB.gameObject };
    else if (pair.bodyB.gameObject instanceof MechanicalHook)
        return { hook: pair.bodyB.gameObject, item: pair.bodyA.gameObject };

    return null;
} 