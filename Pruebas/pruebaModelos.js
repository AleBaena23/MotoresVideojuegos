import * as THREE from 'three'
import Luisito from '../src/luisito.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'

const luisito = new Luisito()

luisito.camera.instance.position.set(0,1,5)
const gltfLoader = new GLTFLoader()

gltfLoader.load(
    'static/models/Fox/Fox.gltf',
    (gltf) => {

        console.log("success")
        console.log(gltf)
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        luisito.scene.add(gltf.scene)
        
    }
)

const ambientLight = luisito.light.CreateAmbient('white', 1)
const directionalLight = luisito.light.CreateDirectional('white', 1)
directionalLight.position.set(0, 0, 0)


const planeMesh = luisito.mesh.CreateFromGeometry(
    new THREE.PlaneGeometry(10,10),
    new THREE.MeshStandardMaterial({
        color: "red",
        metalness:0,
        roughness : 0.5
    })


)

planeMesh.rotateX(-Math.PI/2)
planeMesh.position.set(0,0,0)
console.log(planeMesh.position)

luisito.update = (dt) => {
        
}

luisito.start()