import 'phaser';
import PhaserRaycaster from 'phaser-raycaster';
import MenuScene from './scenes/menuScene';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';
import UIScene from './scenes/uiScene';

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#ffffff',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    scene: [PreloadScene, MenuScene, MainScene, UIScene],
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: { y: 10}
        }
    },
    plugins: {
        scene: [
            {
                key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    }
}

window.addEventListener('load', () => {
    const game = new Phaser.Game(config);
})
