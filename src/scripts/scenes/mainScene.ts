import GameManager from '../objects/GameManager'
import Submarine from '../objects/Submarine'
import FpsText from '../objects/fpsText'
import { MechanicalHook } from '../objects/MechanicalHook'
import { FishGroup } from '../objects/Fishes';
import Background from '../objects/Background';

export default class MainScene extends Phaser.Scene {
    private fpsText: FpsText;
    private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
    private gameManager: GameManager;
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

        const maxDepth: number = 10000;
        this.matter.world.setBounds(0, 0, this.width, maxDepth);
        this.cameras.main.setBounds(0, 0, this.width, maxDepth);
        this.background = new Background(this, maxDepth);
        this.gameManager = new GameManager(this);
        this.submarine = new Submarine(this, this.width / 2, (this.height / 2) + 100);
        this.fpsText = new FpsText(this);
        this.fishGroup = new FishGroup(this, 5);

        this.cameras.main.startFollow(this.submarine);
    }

    update(time: number, delta: number) {
        this.background.draw();
        this.submarine.update();
        this.fpsText.update();
        this.fishGroup.update(delta);
    }
}
