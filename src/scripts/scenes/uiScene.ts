import GameManager from '../objects/GameManager'
import UIGameObject from '../objects/UIGameObject'
import Submarine from '../objects/Submarine'
import FpsText from '../objects/fpsText'
import { MechanicalHook } from '../objects/MechanicalHook'
import { FishGroup } from '../objects/Fishes';
import Background from '../objects/Background';

// TODO: this doesn't show up for some reason!
export default class UIScene extends Phaser.Scene {
    private fpsText: FpsText;
    private width: number;
    private height: number;

    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // this.width = this.cameras.main.width;
        // this.height = this.cameras.main.height;

        this.fpsText = new FpsText(this);
    }

    update(time: number, delta: number) {
        this.fpsText.update();
    }
}