import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'

export default class Physics{

    constructor(luisito)
    {
        this.scene = luisito.scene
        this.world = new CANNON.World()
        this.logger = luisito.logger
        this.cannonDebugger = new CannonDebugger(this.scene, this.world, {})
        
        this.logger.info("Llamando a la clase Físicas");

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

    // Creación de las diferentes fuerzas

    GenerateGravitational(pA, pB, mA, mB, G, minDistance, maxDistance){

        // Se calcula la distancia entre dos objetos
        let distance = pB.clone();
        distance.sub(pA);
        let distanceSquared = distance.lengthSq();

        // Establecemos límites de distancia
        distanceSquared = Math.min(Math.max(distanceSquared, minDistance), maxDistance);

        // Calculamos la dirección de la fuerza de atracción
        distance.normalize();

        // Calculamos la fuerza de la fuerza atracción
        const attractionMagnitude = G * (mA * mB) / distanceSquared;

        // Finalmente, calculamos el vector "fuerza de atracción" resultante
        const gravitationalForce = distance.multiplyScalar(attractionMagnitude);

        return gravitationalForce;
    }

    GenerateDrag (k,objectVelocity){
        let dragVector = new CANNON.Vec3()

        if(objectVelocity.lengthSquared() > 0){
            let dragDirection = objectVelocity.clone()
            dragDirection.normalize()
            dragDirection = dragDirection.negate()

            const dragMagnitude = k * objectVelocity.lengthSquared()

            dragVector = dragDirection.scale(dragMagnitude)
        }
        return dragVector
    }
}