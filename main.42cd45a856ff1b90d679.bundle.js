/*! For license information please see main.42cd45a856ff1b90d679.bundle.js.LICENSE.txt */
(()=>{var e,t={603:(e,t,s)=>{"use strict";var i=s(260);class a{}a.MECHANICAL_HOOK=1,a.MECHANICAL_ARM_SEGMENT=16,a.SUBMARINE=256,a.WALLS=4096,a.PHANTOM_WALLS=65536,a.FISH=1048576,a.HAZARD=1048576;class h extends Phaser.GameObjects.GameObject{constructor(e,t){super(e,"background"),this.SKY_COLOUR=11263972,this.SKY_HEIGHT=180,this.BACKGROUND_COLOUR=2444414,this.SafeSpawnHeight=0,e.add.existing(this),this.graphics=e.add.graphics();const s=new Phaser.GameObjects.Image(e,300,40,"surface-vessel");s.setScale(.15).flipX=!0,e.add.existing(s),this.width=e.cameras.main.width,this.height=t;const h=64,r=i.Math.CeilTo(this.width/h),n=i.Math.CeilTo((r*h-this.width)/2),o=[1],l=[3],c=[5];for(let e=0;e<r-2;e++)o.push(0),l.push(0),c.push(6);o.push(1),l.push(3),c.push(5);const g=[],u=[],d=[];for(let e=0;e<r;e++)g.push(0),u.push(4),d.push(2);const m=[g,g,d,u,l],p=m.length-1,b=i.Math.FloorTo(this.height/h)+1-m.length-2;for(let e=0;e<b;e++)m.push(o.slice());m.push(c),m.push(u),this.tilemap=e.make.tilemap({data:m,tileWidth:h,tileHeight:h,insertNull:!1}),this.tilemap.addTilesetImage("background-tiles",void 0,256,256);const f=this.tilemap.createLayer(0,"background-tiles",-n,0);f.setCollision([1,3,4,5,6]),e.matter.world.convertTilemapLayer(f);const y=b+2;for(let e=0;e<y;e++)this.tilemap.getTileAt(0,e+p).setFlip(!0,!1);const x=f.getTilesWithin(0,0,r,b);for(const e of x){if(!e||!e.physics||!e.physics.matterBody)continue;const t=e.physics.matterBody;4===e.index?(t.setCollisionCategory(a.PHANTOM_WALLS),t.setCollidesWith(a.FISH)):(t.setCollisionCategory(a.WALLS),t.setCollidesWith(a.SUBMARINE|a.MECHANICAL_HOOK))}this.SafeSpawnHeight=p*h,this.scene.add.text(this.width/2,9900,"The real treasure was inside you all along!").setOrigin(.5)}draw(){this.graphics.clear(),this.graphics.fillGradientStyle(this.BACKGROUND_COLOUR,this.BACKGROUND_COLOUR,1,1),this.graphics.fillRect(0,0,this.width,this.height),this.graphics.fillStyle(this.SKY_COLOUR),this.graphics.fillRect(0,0,this.width,this.SKY_HEIGHT)}}class r{constructor(e,t,s){this.bands=[],this.scene=e,this.bandParameters=s,this.bandParameters.forEach((e=>{e.minDepth+=t,e.maxDepth+=t}))}create(){this.bands=this.bandParameters.map((e=>this.CreateBand(this.scene,e))),this.bands.forEach((e=>e.createItems()))}update(e){this.bands.forEach((t=>t.update(e)))}}class n{constructor(e,t){this.generator=new i.Math.RandomDataGenerator,this.items=[],this.activeNumberOfItems=0,this.respawnTimer=0,this.scene=e,this.parameters=t}createItems(){const e=this.parameters.maxNumberOfItems/2;for(let t=0;t<this.parameters.maxNumberOfItems;t++){const s=this.spawnRandomItem(t<e),i=this.createNewItem();i.setParameters(s),this.items.push(i),this.activeNumberOfItems++}}respawnItem(e){const t=this.spawnRandomItem(this.generator.pick([!1]));e.setParameters(t)}removeItem(e){e.dead=!0,e.x=-400,e.y=-400,e.setVelocity(0,0),this.activeNumberOfItems--}update(e){this.items.forEach((e=>e.update())),this.generateNewItem(e)}generateNewItem(e){if(this.activeNumberOfItems>=this.parameters.maxNumberOfItems)return;if(this.respawnTimer+=e,this.respawnTimer<this.parameters.itemRespawnRate)return;this.respawnTimer-=this.parameters.itemRespawnRate;const t=this.items.filter((e=>e.dead));if(!t||t.length<=0)return;const s=t[0];this.respawnItem(s),this.activeNumberOfItems++}getBaseParameters(e){const t=this.scene.cameras.main.width,s=e?-n.safetyGap:t+n.safetyGap,a=this.generator.integerInRange(this.parameters.minDepth,this.parameters.maxDepth),h=this.generator.realInRange(n.minSpeed,n.maxSpeed),r=this.generator.pick(this.parameters.availableItemTypes),o=this.getMaxAngles(s,a,this.parameters.minDepth,this.parameters.maxDepth,e?t:0);let l=this.generator.integerInRange(e?-o.up:o.up,e?o.down:-o.down);e||(l+=180);const c=Math.cos(i.Math.DEG_TO_RAD*l),g=Math.sin(i.Math.DEG_TO_RAD*l),u=this.generator.realInRange(this.parameters.minScale,this.parameters.maxScale);return{type:r,position:new Phaser.Math.Vector2(s,a),directionAngle:l,direction:new Phaser.Math.Vector2(c,g),speed:h,scale:u,left:e}}getMaxAngles(e,t,s,a,h){const r=h+Math.abs(e);let o=Math.atan((t-s)/r)*i.Math.RAD_TO_DEG,l=Math.atan((a-t)/r)*i.Math.RAD_TO_DEG;return o=Math.min(Math.floor(o),n.maxAngle),l=Math.min(Math.floor(l),n.maxAngle),{up:o,down:l}}}n.safetyGap=200,n.minSpeed=.5,n.maxSpeed=1,n.maxAngle=15;class o extends Phaser.Physics.Matter.Image{constructor(e,t,s){super(e.matter.world,-400,-400,s,void 0,o.getMatterBodyConfig()),this.started=!1,this.offscreen=!1,this.dead=!0,this.band=t,this.initialisePhysics(),this.beforeSceneAdd(e),e.add.existing(this)}initialisePhysics(){this.setSensor(!0),this.setIgnoreGravity(!0),this.configureOrigin()}static getMatterBodyConfig(e){const t={frictionAir:0,mass:.001};return e&&(t.shape={type:"fromPhysicsEditor",isStatic:!1,fixtures:[{isSensor:!0,vertices:e}]}),t}beforeSceneAdd(e){}configureOrigin(e){e||this.setOrigin()}setParameters(e){if(e.vertices){const t=e.vertices.map((e=>e.map((e=>({x:e.x||0,y:e.y||0}))))),s=t.reduce(((e,t)=>e.concat(t)));this.scene.matter.vertices.scale(s,e.scale,e.scale,{x:0,y:0});const i=o.getMatterBodyConfig(t);this.setBody(i.shape,i),this.initialisePhysics(),this.configureOrigin(e)}this.x=e.position.x,this.y=e.position.y,this.scale=e.scale,this.setVelocity(e.direction.x*e.speed,e.direction.y*e.speed),this.setRotationDeg(e.left,e.directionAngle),this.started=!0,this.offscreen=!0,this.dead=!1}update(){if(this.dead)return;const e=this.scene.cameras.main.width,t=this.getBounds();this.started&&this.offscreen?t.right<=e&&t.left>=0&&(this.started=!1,this.offscreen=!1):!this.offscreen&&(t.right<0||t.left>e)&&(this.offscreen=!0,this.band.respawnItem(this))}setRotationDeg(e,t){e?this.setFlipX(!0):(this.setFlipX(!1),t+=180),this.angle=t}}class l extends o{constructor(e,t){super(e,t,"fish1l1"),this.worth=0,this.weight=0,this.fishBand=t}initialisePhysics(){super.initialisePhysics(),this.setCollisionCategory(a.FISH),this.setCollidesWith(a.MECHANICAL_HOOK)}beforeSceneAdd(e){super.beforeSceneAdd(e),this.layer2=e.add.image(0,0,"fish1l2")}setParameters(e){super.setParameters(e),this.setTexture(`fish${e.type}l1`),this.setTint(e.layer1Tint),this.layer2.setTexture(`fish${e.type}l2`),this.layer2.x=this.x,this.layer2.y=this.y,this.layer2.scale=this.scale,this.layer2.angle=this.angle,this.layer2.setFlipX(this.flipX),this.layer2.setFlipY(this.flipY),this.layer2.setTint(e.layer2Tint),this.worth=e.worth,this.weight=e.weight}catch(){this.fishBand.removeItem(this)}update(){super.update(),this.layer2.x=this.x,this.layer2.y=this.y}setRotationDeg(e,t){super.setRotationDeg(e,t),e?this.layer2.setFlipX(!0):this.layer2.setFlipX(!1),this.layer2.angle=t}configureOrigin(e){if(e)switch(e.type){case 1:this.setOrigin(.5,.58);break;case 2:this.setOrigin();break;case 3:this.setOrigin(e.left?.48:.52,.5);break;case 4:this.setOrigin(e.left?.48:.52,.49)}else super.configureOrigin()}setOrigin(e,t){return this.layer2&&this.layer2.setOrigin(e,t),super.setOrigin(e,t)}}class c extends n{constructor(e,t){super(e,t),this.collisionData=e.cache.json.get("collision-data")}createNewItem(){return new l(this.scene,this)}spawnRandomItem(e){const t=super.getBaseParameters(e);t.vertices=this.collisionData[`fish-${t.type}-${e?"right":"left"}`].fixtures[0].vertices,t.weight=Math.floor(20*t.scale);const s=this.generator.pick(this.parameters.rarities);return t.layer1Tint=c.fishRarityColours[s-1][0],t.layer2Tint=c.fishRarityColours[s-1][1],t.worth=Math.floor(t.weight*c.fishRarityWorth[s]),t}}c.fishRarityColours=[[13421772,9342093],[8838312,10855332],[16755438,4705919],[10644728,16754432],[16761959,14249156]],c.fishRarityWorth=[.5,1,1.5,2,2.5];class g extends r{constructor(e,t){super(e,t,g.bandParameters)}CreateBand(e,t){return new c(e,t)}}g.bandParameters=[{minDepth:50,maxDepth:2e3,maxNumberOfItems:25,availableItemTypes:[1,2],itemRespawnRate:1e4,minScale:.1,maxScale:.25,rarities:[1,2,3]},{minDepth:2e3,maxDepth:4e3,maxNumberOfItems:20,availableItemTypes:[1,2,3],itemRespawnRate:15e3,minScale:.15,maxScale:.35,rarities:[1,2,3,4]},{minDepth:4e3,maxDepth:6e3,maxNumberOfItems:18,availableItemTypes:[1,2,3],itemRespawnRate:2e4,minScale:.2,maxScale:.4,rarities:[3,4]},{minDepth:6e3,maxDepth:8e3,maxNumberOfItems:15,availableItemTypes:[1,2,3],itemRespawnRate:4e4,minScale:.25,maxScale:.5,rarities:[3,4,5]},{minDepth:8e3,maxDepth:1e4,maxNumberOfItems:12,availableItemTypes:[1,2,3],itemRespawnRate:6e4,minScale:.25,maxScale:.75,rarities:[4,5]}];const u=[...Array(10)].map(((e,t)=>10*(Math.pow(3,t)-1))),d="hms-max-depth",m=new class{constructor(){this.upgrades={capacity:{totalUpgrades:[20,50,80,110,150,200],upgradesBought:0,price:u.slice(0,6)},depthLimit:{totalUpgrades:[150,300,450,600,750,1e3],upgradesBought:0,price:u.slice(0,6)},armour:{totalUpgrades:[2,3,4,5,6],upgradesBought:0,price:u.slice(0,5)},chain:{totalUpgrades:[2,3,4,5],upgradesBought:0,price:u.slice(1,5)},tank:{totalUpgrades:[45,90,135,180,225,270,305],upgradesBought:0,price:u.slice(0,7)},shipSpeed:{totalUpgrades:[5,6,7],upgradesBought:0,price:u.slice(0,3)},clawSpeed:{totalUpgrades:[5,6,7],upgradesBought:0,price:u.slice(0,3)},clawSize:{totalUpgrades:[.25,.3,.35,.4],upgradesBought:0,price:u.slice(0,4)},location:{totalUpgrades:[0,1,2],upgradesBought:0,price:u.slice(0,3)},collectable:{totalUpgrades:[0,1,2],upgradesBought:0,price:u.slice(0,3)}},this.maxDepthReached=0,this.maxDepthReached=0,this.bestMaxDepthReached=this.getBestMaxDepth()}initialise(){this.totalWealth=0,this.CurrentWealth=0,this.maxDepthReached=0,this.currentDepth=0,this.upgradeMenuOpen=!1,this.upgrades.armour.upgradesBought=0,this.upgrades.capacity.upgradesBought=0,this.upgrades.chain.upgradesBought=0,this.upgrades.clawSize.upgradesBought=0,this.upgrades.clawSpeed.upgradesBought=0,this.upgrades.collectable.upgradesBought=0,this.upgrades.depthLimit.upgradesBought=0,this.upgrades.location.upgradesBought=0,this.upgrades.shipSpeed.upgradesBought=0,this.upgrades.tank.upgradesBought=0,this.submarine={oxygen:this.upgrades.tank.totalUpgrades[this.upgrades.tank.upgradesBought],hull:this.getUpgradeValue("depthLimit"),cargo:{fishWeight:0,fishValue:0,oreWeight:0,oreValue:0,researchWeight:0,researchValue:0},isAtSurface:!0,isDead:!1,diedAt:0,holdFull:!1,oxygenLow:!1,pressureWarning:0}}getUpgradeValue(e){const t=this.upgrades[e];return t.totalUpgrades[t.upgradesBought]}purchaseUpgrade(e){const t=this.upgrades[e];if(t.upgradesBought<t.totalUpgrades.length-1){const s=t.price[t.upgradesBought+1];return s<=this.CurrentWealth?(console.log("Upgrading: "+e),t.upgradesBought+=1,this.CurrentWealth-=s,!0):(console.log("Insufficient funds"),!1)}return!1}sellFish(){console.log("I'm selling all my fish!");const e=this.submarine.cargo.fishValue;this.totalWealth+=e,this.CurrentWealth+=e,this.submarine.cargo.fishValue=0,this.submarine.cargo.fishWeight=0,this.submarine.holdFull=!1}sellOre(){console.log("I'm selling all my ore!");const e=this.submarine.cargo.oreValue;this.totalWealth+=e,this.CurrentWealth+=e,this.submarine.cargo.oreValue=0,this.submarine.cargo.oreWeight=0,this.submarine.holdFull=!1}sellResearch(){console.log("I'm selling all my research!");const e=this.submarine.cargo.researchValue;this.totalWealth+=e,this.CurrentWealth+=e,this.submarine.cargo.researchValue=0,this.submarine.cargo.researchWeight=0,this.submarine.holdFull=!1}checkHoldCapacity(e){return this.submarine.cargo.fishWeight+this.submarine.cargo.oreWeight+this.submarine.cargo.researchWeight+e<=this.getUpgradeValue("capacity")||(this.submarine.holdFull=!0,!1)}catchFish(e){!this.checkHoldCapacity(e.weight)||this.submarine.isAtSurface||this.submarine.isDead||(this.submarine.cargo.fishWeight+=e.weight,this.submarine.cargo.fishValue+=e.worth,e.catch())}hitHazard(e){this.submarine.isDead||(this.submarine.hull-=e.damage,e.hit())}collectOre(){}collectResearch(){}fixSub(){const e=this.getUpgradeValue("depthLimit")-this.submarine.hull,t=Math.floor(this.CurrentWealth/.5),s=Math.min(e,t);this.submarine.hull+=s,this.CurrentWealth-=Math.floor(.5*s)}markSubmarineDestroyed(){this.submarine.isDead=!0}updateMaxDepth(e){this.submarine.isDead||((e=Math.floor(e))>m.maxDepthReached&&(m.maxDepthReached=e),e>m.bestMaxDepthReached&&(m.bestMaxDepthReached=e,this.setBestMaxDepth(e)))}getBestMaxDepth(){const e=localStorage.getItem(d)||"0";let t=parseInt(e,10);return(isNaN(t)||t<0)&&(t=0),t}setBestMaxDepth(e){localStorage.setItem(d,e.toString())}get CurrentWealth(){return this.currentWealth}set CurrentWealth(e){isNaN(e)||(this.currentWealth=e)}};class p extends o{constructor(e,t){super(e,t,"hazard1"),this.damage=0,this.hazardBand=t}initialisePhysics(){super.initialisePhysics(),this.setCollisionCategory(a.HAZARD),this.setCollidesWith(a.MECHANICAL_HOOK|a.SUBMARINE)}setParameters(e){super.setParameters(e),this.setTexture(`hazard${e.type}`),this.damage=e.damage}configureOrigin(e){if(e)switch(e.type){case 1:e.left?this.setOrigin(.54,.56):this.setOrigin(.46,.56)}else super.configureOrigin()}hit(){this.hazardBand.removeItem(this)}}const b=220,f=.25;class y extends Phaser.Physics.Matter.Image{constructor(e,t,s=200){super(e.matter.world,t,s,"submarine",void 0,y.getMatterBodyConfig()),e.add.existing(this),this.setupKeys(),this.collisionData=e.cache.json.get("collision-data"),this.displayWidth=this.width*f,this.displayHeight=this.height*f,this.setupPhysics(),this.hook=new x(e,this,m.getUpgradeValue("chain"))}setupPhysics(){const e=this.collisionData["submarine-"+(this.flipX?"right":"left")].fixtures[0].vertices.map((e=>e.map((e=>({x:e.x||0,y:e.y||0}))))),t=e.reduce(((e,t)=>e.concat(t)));this.scene.matter.vertices.scale(t,f,f,{x:0,y:0});const s=this.x,i=this.y,h=y.getMatterBodyConfig(e);this.setBody(h.shape,h),this.setIgnoreGravity(!0),this.setCollisionCategory(a.SUBMARINE),this.setCollidesWith(a.WALLS|a.MECHANICAL_HOOK|a.HAZARD),this.x=s,this.y=i,this.hook&&this.hook.changeSub(this)}static getMatterBodyConfig(e){const t={frictionAir:.05,mass:500};return e&&(t.shape={type:"fromPhysicsEditor",isStatic:!1,fixtures:[{isSensor:!0,vertices:e}]}),t}setupKeys(){this.keys=this.scene.input.keyboard.addKeys({up:"W",down:"S",left:"A",right:"D"},!0,!0)}update(){this.updateKeys(),this.updateArm(),this.updateDepth(),m.submarine.isDead&&!this.wasDeadLastTimeIChecked&&this.killSubmarine()}updateDepth(){const e=(this.y-b)/10;m.currentDepth=e,m.updateMaxDepth(e)}updateArm(){this.hook.update()}updateKeys(){if(m.submarine.isDead)return;const e=m.getUpgradeValue("shipSpeed");let t=this.flipX;this.keys.left.isDown?(this.setVelocityX(-e),t=!0):this.keys.right.isDown&&(this.setVelocityX(e),t=!1),t!==this.flipX&&this.setupPhysics(),this.setFlip(t,!1),this.setRotation(0),this.keys.up.isDown?(this.setVelocityY(1.8*-e),this.setRotation(t?.1:-.1)):this.keys.down.isDown&&(this.setVelocityY(e),this.setRotation(t?-.1:.1)),this.y<b&&(this.y=b),this.y<240?m.submarine.isAtSurface=!0:m.submarine.isAtSurface&&(m.submarine.isAtSurface=!1)}killSubmarine(){this.wasDeadLastTimeIChecked=!0,this.scene.cameras.main.fadeOut(5e3,50,0,0,((e,t)=>{t<1||(this.scene.scene.stop("UIScene"),this.scene.scene.stop("MainScene"),this.scene.scene.start("MenuScene"))})),this.setFrictionAir(.5),this.setIgnoreGravity(!1)}takeDamage(e){this.setColor(16716049),this.scene.cameras.main.shake(150,.03,!1,((e,t)=>{t>=1&&this.setColor()}))}setColor(e){e?this.tint=e:this.clearTint(),this.hook.setTint(e)}checkUpgrades(){m.getUpgradeValue("chain")!==this.hook.getLength()&&this.upgradeArm()}upgradeArm(){this.hook.destroy(),this.hook=new x(this.scene,this,m.getUpgradeValue("chain"))}}class x{constructor(e,t,s=3){let i;this.segments=[];for(let a=0;a<s;a++){const s=i?i.x:t.x,h=i?i.y:t.y;this.segments[a]=new w(e,s,h,i),i=this.segments[a]}this.baseConstraint=e.matter.add.constraint(t,this.segments[0],0,1,{pointA:{x:0,y:15},pointB:{x:-30,y:0}}),this.hook=new M(e,this.segments[s-1],t)}changeSub(e){this.baseConstraint.bodyA=e.body}update(){this.segments.forEach((e=>e.update())),this.hook.update()}getLength(){return this.segments.length}destroy(){this.segments.forEach((e=>e.destroy())),this.hook.destroy()}setTint(e){e?(this.segments.forEach((t=>t.tint=e)),this.hook.tint=e):(this.segments.forEach((e=>e.clearTint())),this.hook.clearTint())}}class w extends Phaser.Physics.Matter.Image{constructor(e,t,s,i){super(e.matter.world,t,s,"chain",void 0,{frictionAir:.05,mass:.3}),this.setIgnoreGravity(!0),this.setCollisionCategory(a.MECHANICAL_ARM_SEGMENT),this.setCollidesWith(0),this.scene=e,this.displayHeight=20,this.displayWidth=80,e.add.existing(this),i&&(this.y+=80,e.matter.add.constraint(i,this,0,1,{pointA:{x:30,y:0},pointB:{x:-30,y:0}}))}}class M extends Phaser.Physics.Matter.Image{constructor(e,t,s){super(e.matter.world,t.x,t.y+40,"mechanical-hook",void 0,{frictionAir:.05,mass:2}),this.setIgnoreGravity(!0),this.setCollisionCategory(a.MECHANICAL_HOOK),this.setCollidesWith(a.WALLS|a.FISH|a.HAZARD),this.sub=s,this.prev=t,e.add.existing(this),this.displayHeight=40,this.displayWidth=40,e.matter.add.constraint(t,this,0,1,{pointA:{x:40,y:0},pointB:{x:0,y:0}})}update(){this.updateMouse(),this.angle=this.prev.angle-90}updateMouse2(){const e=this.scene.cameras.main.worldView.top,t=new Phaser.Math.Vector2(this.scene.input.activePointer.worldX,this.scene.input.activePointer.worldY+e),s=t.clone().subtract(this.sub);if(!m.submarine.isAtSurface&&!m.submarine.isDead){const e=60*m.getUpgradeValue("chain");if(s.length()<e)this.x=t.x,this.y=t.y;else{const t=s.clone().setLength(e).add(this.sub);this.x=t.x,this.y=t.y}}this.y<b&&(this.y=b)}updateMouse(){const e=this.scene.cameras.main.worldView.top,t=new Phaser.Math.Vector2(this.scene.input.activePointer.worldX,this.scene.input.activePointer.worldY+e);if(this.y<b)this.y=221,this.setIgnoreGravity(!1);else{this.setIgnoreGravity(!0);const e=t.subtract(this),s=m.getUpgradeValue("clawSpeed");if(e.length()>s&&!m.submarine.isAtSurface&&!m.submarine.isDead){const t=e.setLength(s);this.setVelocity(t.x,t.y)}else this.setVelocity(0)}}}class S{constructor(e,t){this.scene=e,this.submarine=t,this.scene.matter.world.on("collisionstart",this.watchCollisions.bind(this))}watchCollisions(e){e.pairs.map(B).filter((e=>null!==e)).forEach((e=>{const t=e.item;"hook"===e.type&&t instanceof l&&m.catchFish(t),"sub"===e.type&&t instanceof p&&(m.hitHazard(t),this.submarine.takeDamage(t.damage/20))}))}}function B(e){return e.bodyA.gameObject instanceof M?{type:"hook",hook:e.bodyA.gameObject,item:e.bodyB.gameObject}:e.bodyA.gameObject instanceof y?{type:"sub",sub:e.bodyA.gameObject,item:e.bodyB.gameObject}:e.bodyB.gameObject instanceof y?{type:"sub",sub:e.bodyB.gameObject,item:e.bodyA.gameObject}:e.bodyB.gameObject instanceof M?{type:"hook",hook:e.bodyB.gameObject,item:e.bodyA.gameObject}:null}class O extends n{constructor(e,t){super(e,t),this.collisionData=e.cache.json.get("collision-data")}createNewItem(){return new p(this.scene,this)}spawnRandomItem(e){const t=super.getBaseParameters(e);switch(t.type){case 1:t.vertices=this.collisionData["shark-"+(e?"right":"left")].fixtures[0].vertices;break;case 2:t.vertices=this.collisionData.mine.fixtures[0].vertices}return t.damage=100*t.scale*this.parameters.damage,t}}class k extends r{constructor(e,t){super(e,t,k.bandParameters)}CreateBand(e,t){return new O(e,t)}}k.bandParameters=[{minDepth:200,maxDepth:3e3,minScale:.2,maxScale:.3,damage:1,maxNumberOfItems:12,availableItemTypes:[1],itemRespawnRate:1e4},{minDepth:3e3,maxDepth:6e3,minScale:.3,maxScale:.6,damage:1,maxNumberOfItems:20,availableItemTypes:[1],itemRespawnRate:1e4},{minDepth:5e3,maxDepth:8e3,minScale:.1,maxScale:.3,damage:5,maxNumberOfItems:7,availableItemTypes:[2],itemRespawnRate:1e4},{minDepth:7500,maxDepth:9500,minScale:.2,maxScale:.5,damage:10,maxNumberOfItems:5,availableItemTypes:[2],itemRespawnRate:1e4}];class T extends Phaser.Scene{constructor(){super({key:"MainScene"})}create(){this.spawnableGroups=[],this.cameras.main.fadeIn(500,0,0,0);const e=this.cameras.main.width,t=1e4;this.matter.world.setBounds(0,0,e,t),this.cameras.main.setBounds(0,0,e,t),this.background=new h(this,t),this.spawnableGroups.push(new g(this,this.background.SafeSpawnHeight)),this.spawnableGroups.push(new k(this,this.background.SafeSpawnHeight)),this.spawnableGroups.forEach((e=>e.create())),this.submarine=new y(this,e/2),new S(this,this.submarine),m.initialise(),this.cameras.main.startFollow(this.submarine),this.events.once("shutdown",this.shutdown,this),this.scene.get("UIScene").events.on("upgraded",this.doUpgrades,this)}shutdown(){this.scene.get("UIScene").events.off("upgraded",this.doUpgrades,this)}doUpgrades(){this.submarine.checkUpgrades()}update(e,t){this.matter.step(t),this.background.draw(),this.submarine.update();for(const e of this.spawnableGroups)e.update(t)}}class D{constructor(e,t,s){[e.add.image(t,s,"w-key"),e.add.image(t-50,s+50,"a-key"),e.add.image(t,s+50,"s-key"),e.add.image(t+50,s+50,"d-key")].forEach((e=>{e.displayHeight=70,e.displayWidth=70}));const i=e.add.image(t+150,s+25,"mouse-key");i.displayHeight=100,i.displayWidth=100}}class C extends Phaser.GameObjects.Image{constructor(e,t,s,i,a,h,r,n=!0){super(e,i,a,t),this.disabled=!1,e.add.existing(this),this.buttonText=new Phaser.GameObjects.Text(e,i,a,s,{color:"black",fontSize:"18px"}).setOrigin(.5),e.add.existing(this.buttonText),this.setInteractive({useHandCursor:!0}).setScale(h,.7*h).setAlpha(.25),this.on("pointerdown",(()=>{this.disabled||(r(),this.setAlpha(.25))})),n&&(this.on("pointerover",(()=>this.buttonMouseover())),this.on("pointerout",(()=>this.buttonMouseout())))}buttonMouseover(){this.disabled||this.setAlpha(1)}buttonMouseout(){this.disabled||this.setAlpha(.25)}hide(){this.visible=!1,this.buttonText.visible=!1}show(){this.visible=!0,this.buttonText.visible=!0}setHideShow(e){e?this.show():this.hide()}disable(){this.setTint(3355443),this.buttonText.setColor("white"),this.disabled=!0}enable(){this.setTint(16777215),this.buttonText.setColor("black"),this.disabled=!1}setText(e){this.buttonText.setText(e)}setDisabled(e){e?this.disable():this.enable()}}class I extends Phaser.Scene{constructor(){super({key:"MenuScene"})}preload(){this.load.image("button-background-blue","assets/img/ui/Button_Blue.png"),this.load.image("menu-background","assets/img/ui/Main_Menu.png"),this.load.image("w-key","assets/img/ui/prompts/W_Key_Light.png"),this.load.image("a-key","assets/img/ui/prompts/A_Key_Light.png"),this.load.image("s-key","assets/img/ui/prompts/S_Key_Light.png"),this.load.image("d-key","assets/img/ui/prompts/D_Key_Light.png"),this.load.image("mouse-key","assets/img/ui/prompts/Mouse_Simple_Key_Light.png")}create(){const e=this.cameras.main.width/2,t=this.cameras.main.height/2;this.addBackground(e,t),this.addTitle(e,t),this.playButton=new C(this,"button-background-blue","Play!",e,t-25,.8,(()=>this.startGame()),!1),this.playButton.setAlpha(1),this.add.text(e,this.cameras.main.height-30,"What treasures await at the bottom of the ocean?").setOrigin(.5),m.maxDepthReached>0&&this.add.text(e,this.cameras.main.height-120,`Previous Best Depth: ${m.maxDepthReached}m`).setOrigin(.5),m.bestMaxDepthReached>0&&this.add.text(e,this.cameras.main.height-100,`Overall Best Depth: ${m.bestMaxDepthReached}m`).setOrigin(.5),new D(this,e-50,t+70)}addBackground(e,t){this.background=new Phaser.GameObjects.Image(this,e,t,"menu-background"),this.add.existing(this.background);const s=480/this.background.displayWidth;this.background.setScale(s)}addTitle(e,t){const s=this.add.text(e,t-100,"Hook, Mines & Sinker!");s.setFontSize(40);const i=300/s.displayWidth;s.setScale(i),s.setOrigin(.5)}startGame(){this.cameras.main.fadeOut(500,0,0,0).once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,(()=>{this.scene.start("MainScene"),this.scene.start("UIScene")}))}}class v extends Phaser.Scene{constructor(){super({key:"PreloadScene",active:!0})}preload(){this.load.image("submarine","assets/img/submarine.png"),this.load.image("mechanical-hook","assets/img/claw.png"),this.load.image("chain","assets/img/chain.png"),this.load.image("fish1l1","assets/img/fish/fish1/layer1.png"),this.load.image("fish1l2","assets/img/fish/fish1/layer2.png"),this.load.image("fish2l1","assets/img/fish/fish2/layer1.png"),this.load.image("fish2l2","assets/img/fish/fish2/layer2.png"),this.load.image("fish3l1","assets/img/fish/fish3/layer1.png"),this.load.image("fish3l2","assets/img/fish/fish3/layer2.png"),this.load.image("fish4l1","assets/img/fish/fish4/layer1.png"),this.load.image("fish4l2","assets/img/fish/fish4/layer2.png"),this.load.image("hazard1","assets/img/shark.png"),this.load.image("hazard2","assets/img/mine.png"),this.load.image("background-tiles","assets/img/tiles/wall.png"),this.load.image("surface-vessel","assets/img/Fishing_vessel_1.png"),this.load.image("big-button","assets/img/ui/Big_Button.png"),this.load.image("little-button","assets/img/ui/Little_Button.png"),this.load.image("bottom-left-panel","assets/img/ui/bottom-left-panel.png"),this.load.image("bottom-right-panel","assets/img/ui/bottom-right-panel.png"),this.load.json("collision-data","assets/json/collision.json")}}class A extends Phaser.GameObjects.Text{constructor(e){super(e,10,10,"",{color:"white",fontSize:"28px"}),e.add.existing(this),this.setOrigin(0)}update(){this.setText(`fps: ${Math.floor(this.scene.game.loop.actualFps)}`)}}class R extends Phaser.GameObjects.Graphics{constructor(e,t,s,i,a=i,h,r,n){super(e),this.x=t,this.y=s,this.maxValue=i,this.value=a,this.barWidth=h,this.barHeight=r,this.config=n,e.add.existing(this),this.config.label&&(this.barLabel=new Phaser.GameObjects.Text(e,this.x,this.y-10,this.config.label,{color:"black",fontSize:"16px"}).setOrigin(.5),e.add.existing(this.barLabel))}update(e,t){t&&(this.maxValue=t),this.value=e,this.clear(),this.fillStyle(0),this.fillRect(-this.barWidth/2,0,this.barWidth,this.barHeight),this.fillStyle(16777215),this.fillRect(-this.barWidth/2+2,2,this.barWidth-4,this.barHeight-4);const s=this.value/this.maxValue;this.config.lowThreshold&&this.config.lowColor&&s<this.config.lowThreshold?this.fillStyle(this.config.lowColor):this.config.warnThreshold&&this.config.warnColor&&s<this.config.warnThreshold?this.fillStyle(this.config.warnColor):this.fillStyle(this.config.color);const i=Math.floor(s*(this.barWidth-4));this.fillRect(-this.barWidth/2+2,2,i,this.barHeight-4)}static wiggle(e,t,s){const i=e*Math.PI*2*t,a=e*(2*Math.PI*s+Math.PI/2);return Math.sin(i)*Math.cos(a)}shake(){this.shakeXTween||(this.shakeXTween=this.scene.tweens.add({targets:this,x:this.x+5,duration:500,repeat:-1,ease:e=>R.wiggle(e,1,2),delay:0}),this.shakeYTween=this.scene.tweens.add({targets:this,y:this.y+5,duration:500,repeat:-1,ease:e=>R.wiggle(e,4,5),delay:100}))}stopShake(){this.shakeXTween&&this.shakeYTween&&(this.shakeXTween.stop(0),this.shakeXTween=null,this.shakeYTween.stop(0),this.shakeYTween=null)}}R.wiggleRadius=3;class W{constructor(e,t,s,i){this.buttons=[{label:"O2 Tank",upgrade:"tank"},{label:"Hold Size",upgrade:"capacity"},{label:"Ship Speed",upgrade:"shipSpeed"},{label:"Claw Speed",upgrade:"clawSpeed"},{label:"Hull",upgrade:"depthLimit"},{label:"Claw Length",upgrade:"chain"}],this.buttons.forEach(((a,h)=>{a.uiButton=new C(e,"little-button",a.label,t,s+55*h,.55,(()=>{i.purchaseUpgrade(a.upgrade)&&(e.events.emit("upgraded"),"depthLimit"===a.upgrade&&(i.submarine.hull=i.getUpgradeValue("depthLimit")))}))})),this.gameManager=i}showMenu(e){for(const t of this.buttons){const s=t.uiButton;if(!s)continue;if(!e){s.hide();continue}s.show(),s.disable();const i=this.gameManager.upgrades[t.upgrade];if(i.upgradesBought>=i.totalUpgrades.length-1)continue;const a=i.price[i.upgradesBought+1];s.setText(`${t.label} (${a})`),a>this.gameManager.CurrentWealth||s.enable()}}}const P=.4,G=16711680,H=16753920;class L{constructor(e,t){this.scene=e,this.gameManager=t;const s=this.scene.cameras.main.width,i=this.scene.cameras.main.height,a=s/1550,h=i/972;this.sellFishButton=new C(this.scene,"big-button","Sell Fish",300,200,P,(()=>{t.sellFish()})),this.sellOreButton=new C(this.scene,"big-button","Sell Ore",300,250,P,(()=>{t.sellOre()})),this.sellOreButton.hide(),this.sellResearchButton=new C(this.scene,"big-button","Sell Research",300,300,P,(()=>{t.sellResearch()})),this.sellResearchButton.hide(),this.fixSubButton=new C(this.scene,"big-button","Fix Sub",550,50,P,(()=>{t.fixSub()})),this.upgradeMenuButton=new C(this.scene,"big-button","Shop",550,100,P,(()=>{t.upgradeMenuOpen=!t.upgradeMenuOpen})),this.upgradeMenu=new W(this.scene,735,100,this.gameManager),this.leftBarsBG=new Phaser.GameObjects.Image(e,0,0,"bottom-left-panel"),this.leftBarsBG.setScale(a).setX(this.leftBarsBG.displayWidth/2).setY(i-this.leftBarsBG.displayHeight/2),e.add.existing(this.leftBarsBG);const r=75*a,n=15*a,o=i-this.leftBarsBG.displayHeight,l=16*a,c=this.leftBarsBG.displayWidth-r-n,g=n+c/2,u=Math.ceil(25*h);this.cargoBar=new R(e,g,o+9*l,100,100,c,u,{color:5592405}),this.warningMessage=new Phaser.GameObjects.Text(e,n,o+l+8*a,"I'm a warning",{color:"red",fontSize:20*a+"px",align:"left"}),this.warningMessage.visible=!1,e.add.existing(this.warningMessage),this.currentWealthText=new Phaser.GameObjects.Text(e,n,o+5*l,"0G",{color:"black",fontSize:40*a+"px",align:"left"}),e.add.existing(this.currentWealthText),this.rightBarsBG=new Phaser.GameObjects.Image(e,0,0,"bottom-right-panel"),this.rightBarsBG.setScale(a).setX(s-this.rightBarsBG.displayWidth/2).setY(i-this.rightBarsBG.displayHeight/2),e.add.existing(this.rightBarsBG);const d=s-this.rightBarsBG.displayWidth,m=this.rightBarsBG.displayWidth-r-n,p=d+r+m/2,b=d+r;this.oxygenBar=new R(e,p,o+5*l,100,100,m,u,{warnThreshold:.5,warnColor:H,lowThreshold:.25,lowColor:G,color:35071}),this.hullBar=new R(e,p,o+9*l,100,100,m,u,{warnThreshold:.5,warnColor:H,lowThreshold:.25,lowColor:G,color:65416}),this.currentDepthText=new Phaser.GameObjects.Text(e,b,o+l,"0m / 250m",{color:"black",fontSize:20*a+"px",align:"left"}),e.add.existing(this.currentDepthText),this.maxDepthText=new Phaser.GameObjects.Text(e,b,o+2*l+5*a,"Max Depth: 0m",{color:"black",fontSize:20*a+"px",align:"left"}),e.add.existing(this.maxDepthText)}update(e){const{isAtSurface:t}=this.gameManager.submarine,s=this.gameManager.submarine.cargo.fishWeight>0,i=this.gameManager.CurrentWealth>0,a=this.gameManager.submarine.hull<this.gameManager.getUpgradeValue("depthLimit");t?(this.upgradeMenuButton.show(),this.fixSubButton.show(),this.fixSubButton.setDisabled(!i||!a),this.sellFishButton.show(),this.sellFishButton.setDisabled(!s)):(this.upgradeMenuButton.hide(),this.fixSubButton.hide(),this.sellFishButton.hide()),this.warningMessage.setText("").visible=!1;const{holdFull:h}=this.gameManager.submarine;h&&(this.warningMessage.setText("Hold Full!").visible=h);const{pressureWarning:r,oxygenLow:n}=this.gameManager.submarine;n?(this.warningMessage.setText("Oxygen Level Low!").visible=!0,this.oxygenBar.shake()):this.oxygenBar.stopShake(),0===r?this.hullBar.stopShake():1==r?(this.warningMessage.setText("Hull Breach!").visible=!0,this.hullBar.shake()):(this.warningMessage.setText("Hull Breach Critical!").visible=!0,this.hullBar.shake()),t||(this.gameManager.upgradeMenuOpen=!1),this.upgradeMenu.showMenu(this.gameManager.upgradeMenuOpen),this.currentWealthText.setText(`${this.gameManager.CurrentWealth}G`),this.currentDepthText.setText(`${Math.floor(this.gameManager.currentDepth)}m / ${this.gameManager.getUpgradeValue("depthLimit")}m`),this.maxDepthText.setText(`Max Depth: ${Math.floor(this.gameManager.maxDepthReached)}m`),this.updateOxygen(e),this.updateHull(e),this.updateCargo()}updateOxygen(e){const t=this.gameManager.getUpgradeValue("tank");this.gameManager.submarine.isAtSurface?(this.gameManager.submarine.oxygen+=.06*e,this.gameManager.submarine.oxygenLow=!1):this.gameManager.submarine.oxygen-=.003*e,this.gameManager.submarine.oxygen=Math.max(0,Math.min(this.gameManager.submarine.oxygen,t)),this.oxygenBar.update(this.gameManager.submarine.oxygen,t),this.gameManager.submarine.oxygen/t<=(this.oxygenBar.config.lowThreshold||0)&&(this.gameManager.submarine.oxygenLow=!0),this.gameManager.submarine.oxygen<=0&&this.gameManager.markSubmarineDestroyed()}updateHull(e){const t=this.gameManager.getUpgradeValue("depthLimit"),s=Math.max(0,this.gameManager.currentDepth/t-1);this.gameManager.submarine.hull-=.06*s*e,this.gameManager.submarine.hull=Phaser.Math.Clamp(this.gameManager.submarine.hull,0,t),this.hullBar.update(this.gameManager.submarine.hull,t),this.gameManager.submarine.hull/t<(this.hullBar.config.lowThreshold||0)?this.gameManager.submarine.pressureWarning=2:this.gameManager.submarine.pressureWarning=s>0?1:0,this.gameManager.submarine.hull<=0&&this.gameManager.markSubmarineDestroyed()}updateCargo(){const e=this.gameManager.submarine.cargo.fishWeight+this.gameManager.submarine.cargo.oreWeight+this.gameManager.submarine.cargo.researchWeight;this.cargoBar.update(e,this.gameManager.getUpgradeValue("capacity"))}}class U extends Phaser.Scene{constructor(){super({key:"UIScene"})}create(){this.fpsText=new A(this),this.uiGameObject=new L(this,m)}update(e,t){this.fpsText.update(),this.uiGameObject.update(t)}}window.addEventListener("load",(()=>{new Phaser.Game({type:Phaser.AUTO,backgroundColor:"#244b7e",scale:{parent:"phaser-game",mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:window.innerWidth,height:window.innerHeight},scene:[I,v,T,U],physics:{default:"matter",matter:{debug:!1,gravity:{y:10},autoUpdate:!1}}})}))},204:()=>{console.log("%c %c %c %c %c Built using phaser-project-template %c https://github.com/yandeu/phaser-project-template","background: #ff0000","background: #ffff00","background: #00ff00","background: #00ffff","color: #fff; background: #000000;","background: none")}},s={};function i(e){var a=s[e];if(void 0!==a)return a.exports;var h=s[e]={exports:{}};return t[e].call(h.exports,h,h.exports,i),h.exports}i.m=t,e=[],i.O=(t,s,a,h)=>{if(!s){var r=1/0;for(l=0;l<e.length;l++){for(var[s,a,h]=e[l],n=!0,o=0;o<s.length;o++)(!1&h||r>=h)&&Object.keys(i.O).every((e=>i.O[e](s[o])))?s.splice(o--,1):(n=!1,h<r&&(r=h));n&&(e.splice(l--,1),t=a())}return t}h=h||0;for(var l=e.length;l>0&&e[l-1][2]>h;l--)e[l]=e[l-1];e[l]=[s,a,h]},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={179:0};i.O.j=t=>0===e[t];var t=(t,s)=>{var a,h,[r,n,o]=s,l=0;for(a in n)i.o(n,a)&&(i.m[a]=n[a]);if(o)var c=o(i);for(t&&t(s);l<r.length;l++)h=r[l],i.o(e,h)&&e[h]&&e[h][0](),e[r[l]]=0;return i.O(c)},s=self.webpackChunkphaser_project_template=self.webpackChunkphaser_project_template||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})(),i.O(void 0,[216],(()=>i(603)));var a=i.O(void 0,[216],(()=>i(204)));a=i.O(a)})();