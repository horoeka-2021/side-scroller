import { Physics } from "phaser";

export class Bullet extends Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'adventurer')
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta)

        if (this.x >= 500) {
            this.setActive(false)
            this.setVisible(false)
        }
    }

    fire(x, y) {
        this.body.reset(x, y)

        this.setActive(true)
        this.setVisible(true)

        this.setVelocityX(250)
    }
}