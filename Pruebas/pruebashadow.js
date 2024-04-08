import * as THREE from 'three'
import Luisito from '/src/luisito.js'

const luisito = new Luisito()
luisito.camera.instance.position.set(2,3,7)

const ambientLight = luisito.Light.CreateAmbient('white',0.5)

const directionalLight = luisito.Light.CreateDirectional('white',1)
directionalLight.position.set(5,5,1)

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

luisito.update = (dt) => {
    cubeMesh.rotateX(dt)
    cubeMesh.rotateY(dt)
}

luisito.Start()