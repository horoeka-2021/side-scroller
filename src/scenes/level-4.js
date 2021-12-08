import { Scene, Curves } from 'phaser'
import { MobSpawner } from '../classes/groups/mob-spawner'
import { Player } from '../classes/player'
import { Trigger } from '../classes/triggers/endLevel'
import { Otter } from '../classes/bosses/otter'

export class Level4 extends Scene {
  constructor () {
    super('level-4-scene')
  }

  create () {
    this.sceneNum = 4

    this.initMap()
    this.initPlayer()
    this.triggerSetup()
    this.pathSetup()
    this.enemySetup()
    this.uISetup()
    this.cameraSetup()

    this.sound.stopAll()
    this.sound.add('portalAudio')
    this.sound.add('stepsAudio')
    this.sound.add('playerFireAudio')
    this.sound.add('level4BgAudio')
    this.sound.play('level4BgAudio', { volume: 0.3, loop: true })
  }

  changeScene () {
    this.scene.start('level-45-scene')
  }

  initMap () {
    const level4map = this.make.tilemap({ key: 'level4-map' })
    const cloudTileSetLevel4 = level4map.addTilesetImage('cloud_tileset', 'level4Clouds')
    const tileSetLevel4 = level4map.addTilesetImage('Terrain', 'level4Ground')
    const breakTiles = level4map.addTilesetImage('Retro-Lines-Tiles-transparent', 'level45')

    this.walls = level4map.createLayer('walls', tileSetLevel4)
    this.jumpLayer = level4map.createLayer('jumpLayer', tileSetLevel4)
    // creating bg
    this.add.image(400, 300, 'level4Bg1').setScale(3)
      .setScrollFactor(0)
    this.add.image(400, 500, 'level4Bg2')
      .setScrollFactor(0.1)
    this.add.image(400, 220, 'level4Bg4')
      .setScrollFactor(0.3)
    this.add.image(400, 600, 'level4Bg5')
      .setScrollFactor(0.5)
    this.add.tileSprite(400, 450, 8000, 1000, 'level4Bg6')
      .setScrollFactor(0.8)
    // creating tilemap
    // creating layers to reflect tilemap layers - order matters for rendering
    this.water = level4map.createLayer('Water', cloudTileSetLevel4, 0, 0)
    level4map.createLayer('Etc', cloudTileSetLevel4, 0, 0)
    level4map.createLayer('Platforms', cloudTileSetLevel4, 0, 0)
    level4map.createLayer('Land', tileSetLevel4, 0, 0)
    level4map.createLayer('Break', breakTiles)
    // setting collision property to ground
    this.jumpLayer.setCollisionByExclusion(-1, true)
    this.walls.setCollisionByExclusion(-1, true)
    this.water.setCollisionByExclusion(-1, true)
  }

  initPlayer () {
    this.player = new Player(this, 100, 930)
  }

  cameraSetup () {
    this.cameras.main.setViewport(0, 0, 960, 540)
    this.physics.world.setBounds(0, 0, 4800, 1088)
    this.cameras.main.startFollow(this.player, false, 0.5, 0.5, -400, 20)
    this.cameras.main.setBounds(0, 0, 4800, 1088)
  }

  enemySetup () {
    const carrotConifg = {
      key: {
        run: '-run',
        idle: '-idle'
      },
      w: 48,
      h: 48,
      xOff: 0,
      yOff: 0,
      scale: 3,
      prefix: 'carrot-',
      frameRate: 4,
      frameEnds: {
        idle: 0,
        run: 2,
        death: 4
      }
    }

    this.carrotSpawn = new MobSpawner(this, 3000, 1000, 'carrot', carrotConifg)
    this.add.existing(this.carrotSpawn)

    this.time.addEvent({
      callback: () => this.carrotSpawn.spawnMob(3000, 850),
      callbackScope: this,
      delay: 4000,
      loop: true
    })
    this.otter = new Otter(this, 4414, 850)
  }

  triggerSetup () {
    this.endLevel = new Trigger(this, 4245, 915)
  }

  pathSetup () {
    const points1 = [50, 400, 135, 400]
    const flyingPoints = [50, 400, 125, 320, 200, 400]
    this.curve = new Curves.Spline(points1)
    this.flying = new Curves.Spline(flyingPoints)
  }

  uISetup () {
    // change position if needed (but use same position for both images)
    var backgroundBar = this.add.image(150, 50, 'green-bar')
    backgroundBar.setScrollFactor(0)

    this.playerHealthBar = this.add.image(155, 50, 'red-bar')
    this.playerHealthBar.setScrollFactor(0)

    // add text label to left of bar
    this.healthLabel = this.add.text(40, 40, 'Health', { fontSize: '20px', fill: '#ffffff' })
    this.healthLabel.setScrollFactor(0)
  }

  update () {
    this.endLevel.update()
    if (this.player.hp > 0) {
      this.player.update()
    } else if (this.player.active) {
      this.player.die()
    }
  }
}
