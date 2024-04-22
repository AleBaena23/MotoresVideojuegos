import * as CANNON from 'cannon-es'

export default class Physics{

    constructor(luisito)
    {
        this.scene = luisito.scene
        this.world = new CANNON.World()
        this.logger = luisito.logger
        this.logger.info('Physic constructor called')

    }

    Update(dt, objects) {
        this.world.step(1/60, dt, 3);

        for (const object of objects) {
            if (object.rigidbody) {
                object.position.copy(object.rigidbody.position)
                object.quaternion.copy(object.rigidbody.quaternion)
            }
        }
    }

    CreateBody(options){

        const body = new CANNON.Body(options)
        this.world.addBody(body)

        return body
    }
}