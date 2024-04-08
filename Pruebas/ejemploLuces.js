import * as THREE from 'three'
import Luisito from '/src/luisito.js';

const luisito = new Luisito()

luisito.camera.instance.position.set(2,3,7)

const ambientLight = luisito.light.CreateAmbient('white', 0.5)

const pointLight = luisito.light.CreatePoint('blue', 1)
pointLight.position.set(-1,-1,-1)


const directionalLight = luisito.light.CreateDirectional('white',1)
directionalLight.position.set(5,3,1)

const cubeMesh = luisito.mesh.CreateFromGeometry(

    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshStandardMaterial({color: 'crimson'})

)

luisito.update = (dt) => {
    cubeMesh.rotateX(dt)
    cubeMesh.rotateY(dt)
    cubeMesh.rotateZ(dt)
}

luisito.start()



