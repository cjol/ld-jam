
import GameManager from "./GameManager";

export default class UIButton extends Phaser.GameObjects.Image{

    gameManager: GameManager;
    buttonKey: string;
    buttonText: Phaser.GameObjects.Text;

    constructor(scene: Phaser.Scene, buttonKey: string, buttonText: string, x: number, y: number, gameManager:GameManager) {

        // Add the image
        super(scene,x,y,'button-background');
        scene.add.existing(this);

        // Add text to the button
        this.buttonText = new Phaser.GameObjects.Text(scene, x, y, buttonText, { color: 'green', fontSize: '28px' });
        scene.add.existing(this.buttonText);

        this.buttonKey = buttonKey;
        this.gameManager = gameManager;

        // Make the button interactive, set the scale and set it as transparent at first
        this.setInteractive({useHandCursor:true});
        // this.setScale(0.25);
        this.setAlpha(0.25);

        let self = this;

        // Set the on click method
        this.on('pointerdown',function(){self.buttonWasClicked()})
        this.on('pointerover',function(){self.buttonMouseover()})
        this.on('pointerout',function(){self.buttonMouseout()})

    }

    // Run when the button is clicked
    buttonWasClicked() {
        let didUpgrade = false;
        switch(this.buttonKey) {
            // Selling buttons
            case 'sell-fish-button':
                this.gameManager.sellFish();
                break;
            case 'sell-ore-button':
                this.gameManager.sellOre();
                break;
            case 'sell-research-button':
                this.gameManager.sellResearch();
                break;

            // Open the upgrade menu
            case 'upgrade-menu-button':
                this.gameManager.upgradeMenuOpen = !this.gameManager.upgradeMenuOpen;
                break;

            // Upgrade buttons
            case 'upgrade-oxygen-button':
                didUpgrade = this.gameManager.purchaseUpgrade('tank');
                break;
            case 'upgrade-cargo-capacity':
                didUpgrade = this.gameManager.purchaseUpgrade('capacity');
                break;
            case 'upgrade-chain-length':
                didUpgrade = this.gameManager.purchaseUpgrade('chain');
                break;
        }
        if (didUpgrade) this.scene.events.emit('upgraded');

    }
    buttonMouseover() {
        this.setAlpha(1)
    }
    buttonMouseout() {  
        this.setAlpha(0.25)
    }

}