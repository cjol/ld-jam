// Class to manage the game by keeping track of upgrades and money earned
export default class GameManager {

    upgrades: {};
    totalWealth: number;
    currentWealth: number;
    maxDepthReached: number;
    currentDepth: number;

    // Initialise the game
    constructor(scene: Phaser.Scene) {

        // At the start of the game, set all upgrades to 0
        this.upgrades = {
            // Capacity (units are pseudo-kg)
            capacity:{current:10,
                        totalUpgrades:[10,20,30,50,75,100],
                        upgradesBrought:0
            },
            // Pressure hull
            depthLimit:{current:250,
                        totalUpgrades:[250,500,1000,2000,3000,10000],
                        upgradesBrought:0
            },
            // Armour (units are collisions allowed)
            armour:{current:2,
                    totalUpgrades:[2,3,4,5,6],
                    upgradesBrought:0
            },
            // Chain length
            chain:{current:2,
                    totalUpgrades:[2,3,4],
                    upgradesBrought:0
            },
            // O2 tank (units are seconds underwater)
            tank:{current:45,
                totalUpgrades:[45,90,135,180,225,270,305],
                upgradesBrought:0
            },
            // Ship speed
            shipSpeed:{current:5,
                    totalUpgrades:[5,6,7],
                    upgradesBrought:0
            },
            // Claw speed
            clawSpeed:{current:5,
                        totalUpgrades:[5,6,7],
                        upgradesBrought:0  
            },
            // Claw size (units are 'scale')
            clawSize:{current:0.25,
                        totalUpgrades:[0.25,0.3,0.35,0.4],
                        upgradesBrought:0
            },
            // Location
            location:{current:0,
                    totalUpgrades:[0,1,2],
                    upgradesBrought:0
            },
            // Collectables - can collect fish (level 1), minerals (level 2), research (level 3)
            collectable:{current:0,
                        totalUpgrades:['fish','minerals','research'],
                        upgradesBrought:0
            }

        }

    }

    // Called on clicking on an upgrade
    purchaseUpgrade(upgradeType) {

        var upgradeData = this.upgrades[upgradeType]

        if (upgradeData.upgradesBrought < upgradeData.totalUpgrades.length) {
            upgradeData.upgradesBrought += 1;
        }

    }
}