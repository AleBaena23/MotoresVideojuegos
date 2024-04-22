import * as THREE from 'three'
import Luisito from '/src/luisito.js';

const luisito = new Luisito()

luisito.camera.instance.position.set(0,1,5)
//const ambientLight = luisito.light.CreateAmbient('white', 2)
const directionalLight = luisito.light.CreateDirectional('white', 5)
directionalLight.position.set(0, 2, 1)

const player = luisito.createObject()
luisito.addComponentToObject(
    player,
    'mesh',
    luisito.mesh.CreateFromGeometry(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshStandardMaterial({color:'yellow'})

    )
)

console.log(player)

luisito.update = (dt) => {
    player.rotateY(dt)
    //console.log(dt)
}

luisito.start()