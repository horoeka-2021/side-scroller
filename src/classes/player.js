import { Actor } from './actor'
import { BulletGroup } from './groups/bullet-group'

export class Player extends Actor {
  constructor (scene, x, y) {
    super(scene, x, y, 'adventurer')

    this.keyW = this.scene.input.keyboard.addKey('W')
    this.keyA = this.scene.input.keyboard.addKey('A')
    this.keyS = this.scene.input.keyboard.addKey('S')
    this.keyD = this.scene.input.keyboard.addKey('D')
    this.keyShoot = this.scene.input.keyboard.addKey('SPACE')

    this.gun = new BulletGroup(this.scene, 30, 50, false, 50)

    this.setScale(0.5)

    this.godMode = false

    this.name = 'player'

    this.speed = 220
    this.jump = 220

    this.canShoot = true
    this.canJump = true

    this.body.setSize(55, 85)
    this.body.setOffset(82, 55)

    this.initAnimations()
    this.setColliders()
  }

  fire () {
    this.gun.fireBullet(this.x, this.y, this.flipX, false)
  }

  initAnimations () {
    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNames('player', {
        prefix: 'idle-',
        end: 5
      }),
      frameRate: 12
    })

    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNames('player', {
        prefix: 'run-',
        end: 7
      }),
      frameRate: 12
    })

    this.scene.anims.create({
      key: 'attack',
      frames: this.scene.anims.generateFrameNames('player', {
        prefix: 'atk-',
        end: 3
      }),
      frameRate: 12
    })

    this.scene.anims.create({
      key: 'player-death',
      frames: this.scene.anims.generateFrameNames('player', {
        prefix: 'death-',
        end: 6
      }),
      framerate: 12,
      repeat: 0
    })
  }

  setColliders () {
    this.scene.physics.world.addCollider(this, this.scene.platforms, () => {
      this.canJump = true
    })

    this.scene.physics.world.addCollider(this.gun, this.scene.platforms)
  }

  hitGround () {
    return !this.canJump
  }

  checkGodMode () {
    if (this.godMode) {
      this.speed = 440
      this.jump = 300
    } else {
      this.speed = 220
      this.jump = 220
    }
  }

  update () {
    this.checkGodMode()

    if (this.active) {
      this.setVelocityX(0)
      this.body.setOffset(82, 55)

      if (this.keyShoot.isUp) {
        this.canShoot = true
      }
      if (this.keyW.isDown && this.canJump) {
        if (!this.godMode) {
          this.canJump = false
        }
        this.body.velocity.y = -this.jump
      }
      if (this.keyShoot.isDown) {
        this.anims.play('attack', true)
        if (this.canShoot) {
          this.fire()
          this.canShoot = false
        }
      } else if (this.keyA.isDown) {
        this.anims.play('run', true)
        this.body.velocity.x = -this.speed
        this.checkFlip()
        this.body.setOffset(95, 55)
      } else if (this.keyD.isDown) {
        this.anims.play('run', true)
        this.body.velocity.x = this.speed
        this.checkFlip()
      } else {
        this.anims.play('idle', true)
        if (this.flipX) {
          this.body.setOffset(95, 55)
        }
      }
    }
  }
}
