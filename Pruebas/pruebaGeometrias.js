import Luisito from '../src/luisito.js'
import * as THREE from 'three'

const luisito = new Luisito()

const torusMesh = luisito.mesh.CreateFromGeometry(

    new THREE.TorusGeometry(200,150,16,16),
    new THREE.MeshBasicMaterial({color: 'red', wireframe: true})

)
torusMesh.position.y = 0
torusMesh.position.x = 0

luisito.update = (dt) => {
    torusMesh.rotateZ(dt)
}
luisito.start()