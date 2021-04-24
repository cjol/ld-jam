
import GameManager from "./GameManager";

export default class UIButton extends Phaser.GameObjects.Sprite{

    gameManager: GameManager;
    buttonKey: string;

    constructor(scene: Phaser.Scene, buttonKey: string, x: number, y: number, gameManager:GameManager) {

        // Add the image
        super(scene,x,y,buttonKey);
        scene.add.existing(this);
        this.buttonKey = buttonKey;
        this.gameManager = gameManager;

        // Make the button interactive, set the scale and set it as transparent at first
        this.setInteractive();
        this.setScale(0.25);
        this.setAlpha(0.25);

        let self = this;

        // Set the on click method
        this.on('pointerdown',function(){self.buttonWasClicked()})
        this.on('pointerover',function(){self.buttonMouseover()})
        this.on('pointerout',function(){self.buttonMouseout()})

    }

    // Run when the button is clicked
    buttonWasClicked() {
        switch(this.buttonKey) {
            case 'sell-fish-button':
                this.gameManager.sellFish();
                break;
            case 'sell-ore-button':
                this.gameManager.sellOre();
                break;
            case 'sell-research-button':
                this.gameManager.sellResearch();
                break;
        }
    }
    buttonMouseover() {
        this.setAlpha(1)
    }
    buttonMouseout() {  
        this.setAlpha(0.25)
    }

}