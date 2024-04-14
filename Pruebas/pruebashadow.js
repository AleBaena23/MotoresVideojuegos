import * as THREE from 'three'
import Luisito from '/src/luisito.js'

const luisito = new Luisito()
luisito.camera.instance.position.set(0,1,7)


const ambientLight = luisito.light.CreateAmbient('white',0.5)

const directionalLight = luisito.light.CreateDirectional('white',12)
directionalLight.position.set(0,2,0)
directionalLight.castShadow = true
const helper = new THREE.DirectionalLightHelper(directionalLight, 1,'blue');
luisito.scene.add(helper);

const planeMesh = luisito.mesh.CreateFromGeometry(
    new THREE.PlaneGeometry(10,10),
    new THREE.MeshStandardMaterial()
)
planeMesh.rotateX(-Math.PI/2)

const cubeMesh = luisito.mesh.CreateFromGeometry(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshStandardMaterial({color: 'crimson'})
)
cubeMesh.position.set(0,1,0)

cubeMesh.castShadow = true
cubeMesh.receiveShadow = true

planeMesh.castShadow = true
planeMesh.receiveShadow = true

luisito.update = (dt) => {
    cubeMesh.rotateX(0.01)
    cubeMesh.rotateY(0.01)
}

luisito.start()