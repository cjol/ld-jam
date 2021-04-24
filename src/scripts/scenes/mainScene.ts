import Submarine from '../objects/Submarine'
import FpsText from '../objects/fpsText'
import MechanicalHook from '../objects/MechanicalHook'
import Fish from '../objects/Fish';
import Background from '../objects/Background';

export default class MainScene extends Phaser.Scene {
    fpsText: FpsText;
    cursor: Phaser.Types.Input.Keyboard.CursorKeys;
    submarine: Submarine;
    hook: MechanicalHook;
    fish: Fish;
    background: Background;

    constructor() {
        super({ key: 'MainScene' });
    }

    create() {
        this.background = new Background(this);
        this.submarine = new Submarine(this, this.cameras.main.width / 2, 0);
        this.hook = new MechanicalHook(this, this.cameras.main.width / 2 + 100, 0);
        this.fpsText = new FpsText(this);

        this.cursor = this.input.keyboard.createCursorKeys();

        // this.input.on('pointermove', this.pointerMove.bind(this));

        var fishGroup = this.add.group({key:'fish',frame:[1,2,3,4],setXY:
                                                                            {
                                                                                x: 100,
                                                                                y: 100,
                                                                                stepX: 64,
                                                                                stepY: 64
                                                                            }
        })
    }

    update() {
        this.background.draw();
        this.submarine.update(this.cursor);
        this.fpsText.update();

            this.hook.update(this.input.activePointer)
    }

    // pointerMove(pointer: {x: number, y: number}) {
    // }
}
