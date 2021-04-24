import Background from "../objects/Background";
import { FishGroup } from "../objects/Fishes";
import GameWorld from "../objects/GameWorld";
import { MechanicalHook } from "../objects/MechanicalHook";
import { Raycaster } from "../objects/Raycaster";
import Submarine from "../objects/Submarine";

export default class MainScene extends Phaser.Scene {
    private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
    private gameWorld: GameWorld;
    private submarine: Submarine;
    private hook: MechanicalHook;
    private fishGroup: FishGroup;
    private background: Background;
    private width: number;
    private height: number;

    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;

        const raycaster = new Raycaster(this.matter);

        const maxDepth: number = 10000;
        this.matter.world.setBounds(0, 0, this.width, maxDepth);
        this.cameras.main.setBounds(0, 0, this.width, maxDepth);
        this.background = new Background(this, maxDepth, raycaster);
        this.submarine = new Submarine(this, this.width / 2, 200);
        this.fishGroup = new FishGroup(this, raycaster, 10, this.background.SafeSpawnHeight);
        this.gameWorld = new GameWorld(this,this.submarine);

        this.cameras.main.startFollow(this.submarine);
    }

    update(time: number, delta: number) {
        this.background.draw();
        this.submarine.update();
        this.fishGroup.update(delta);
    }
}
