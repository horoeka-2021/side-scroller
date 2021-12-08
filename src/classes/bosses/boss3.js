import { Math } from 'phaser'
import { Actor } from '../actor'
import { Gun } from '../groups/gun'
import { MobSpawner } from '../groups/mob-spawner'

export class Boss3 extends Actor {
  constructor (scene, x, y) {
    super(scene, x, y, 'ahmad-boss')

    this.hp = 100
    this.maxHealth = 100

    this.setScale(3)
    this.setSize(61, 83)
    this.setOffset(119, 76)
    this.setAnims()
    this.name = 'boss3'

    const ahmadMob = {
      key: {
        atk: '-atk',
        run: '-run',
        idle: 'idle'
      },
      w: 30,
      h: 30,
      xOff: 50,
      yOff: 3,
      scale: 2,
      frameRate: 12,
      frameEnds: {
        idle: 4,
        run: 7,
        atk: 7
      }
    }
    this.spawner = new MobSpawner(this.scene, 50, -30, 'gen-mob-1', ahmadMob, 10)

    this.forLoopGun = new Gun(this.scene, x, y - 400, 300)
    this.scene.add.existing(this.spawner)
    this.setColliders(scene)

    this.scene.time.addEvent({
      callback: this.fireGun,
      callbackScope: this,
      delay: 500,
      loop: true
    })
  }

  fireGun () {
    const config = {
      gunAnim: 'forloop-ware',
      enemyGun: true,
      playerGun: false
    }
    if (this.active && this.scene.player.active && Math.Distance.Between(this.scene.player.x, this.scene.player.y, this.x, this.y) < 400) {
      this.forLoopGun.fireBullet(this.x, this.y, this.flipX, config)
    }
  }

  setAnims () {
    // idle
    this.scene.anims.create({
      key: 'idle-ahmad-boss',
      frames: this.scene.anims.generateFrameNames('ahmad-boss', {
        prefix: 'idle-',
        end: 5
      }),
      frameRate: 12,
      repeat: -1
    })

    // run/ walk
    this.scene.anims.create({
      key: 'run-ahmad-boss',
      frames: this.scene.anims.generateFrameNames('ahmad-boss', {
        prefix: 'run-',
        end: 11
      }),
      frameRate: 100,
      repeat: -1
    })

    // death
    this.scene.anims.create({
      key: 'boss3-death',
      frames: this.scene.anims.generateFrameNames('ahmad-boss', {
        prefix: 'death-',
        end: 21
      }),
      frameRate: 12,
      repeat: 0
    })

    // attack
    this.scene.anims.create({
      key: 'attack-ahmad-boss',
      frames: this.scene.anims.generateFrameNames('ahmad-boss', {
        prefix: 'atk-',
        end: 14
      }),
      frameRate: 12
    })
  }

  die () {
    this.setVelocityX(0)
    this.anims.play(this.name + '-death', true)
    this.scene.ahmad.spawn()
    this.scene.endLevel.setActive(true)
    this.scene.endLevel.setVisible(true)
    this.once('animationcomplete', () => {
      console.log('animationcomplete')
      this.destroy()
    })
  }

  setColliders (scene) {
    scene.physics.world.addCollider(this.scene.player, this)
    scene.physics.world.addCollider(this, this.scene.jumpLayer)
    scene.physics.world.addCollider(this, this.scene.wall)

    scene.physics.world.addCollider(scene.player.gun, this, (boss, bullet) => {
      this.spawner.spawnMob(this.x, this.y)
      this.scene.sound.play('enemyDamage', { loop: false })
      this.getDamage(10)
      bullet.destroy()
      this.scene.sound.stopByKey('stepsAudio')
      this.scene.sound.play('stepsAudio', { volume: 0.08, loop: false })
    })

    scene.physics.world.addCollider(this.scene.player, this.forLoopGun, (player, bullet) => {
      player.getDamage(10)
      scene.playerHealthBar.scaleX -= 10
      scene.playerHealthBar.x -= 1
      scene.sound.play('playerDamageAudio', { volume: 0.1, loop: false })
      bullet.destroy()
    })
  }

  update () {
    const dist = Math.Distance.BetweenPointsSquared(this, this.scene.player) / 2
    if (this.active && this.hp > 0) {
      this.boss2Flip()
      if (this.active && this.hp < 50 && dist > 800000) {
        this.scene.physics.accelerateToObject(this, this.scene.player, 100, 180)
        this.anims.play('run-ahmad-boss', true)
      } else if (this.active && this.hp < 50 && dist < 60000) {
        this.anims.play('attack-ahmad-boss', true)
      } else if (dist < 60000) {
        this.anims.play('attack-ahmad-boss', true)
      } else if (dist < 200000) {
        this.scene.physics.accelerateToObject(this, this.scene.player)
        this.anims.play('run-ahmad-boss', true)
      } else {
        this.setVelocityX(0)
        this.anims.play('idle-ahmad-boss', true)
      }
    }
  }
}
