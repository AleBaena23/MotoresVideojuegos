import * as THREE from 'three'
import Luisito from '/src/luisito.js';

const luisito = new Luisito()

luisito.camera.instance.position.set(0,0,2.25)

/**TEXTURAS */

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

loadingManager.onStart = () =>{
    console.log('loading started')
}
loadingManager.onLoad = () => {
    console.log('loading finished')
}
const colorTexture = textureLoader.load('/static/textures/Door/Door_Wood_001_basecolor.jpg')
const aoTexture = textureLoader.load('/static/textures/Door/Door_Wood_001_ambientOcclusion.jpg')
const heightTexture = textureLoader.load('/static/textures/Door/Door_Wood_001_height.jpg')
const metalTexture = textureLoader.load('/static/textures/Door/Door_Wood_001_metallic.jpg')
const roughTexture = textureLoader.load('/static/textures/Door/Door_Wood_001_roughness.jpg')
const normalTexture = textureLoader.load('/static/textures/Door/Door_Wood_001_normal.jpg')
const alphaTexture = textureLoader.load('/static/textures/Door/Door_Wood_001_opacity.jpg')


/**LUCES */

const ambientLight = luisito.light.CreateAmbient('white', 1)
const directionalLight = luisito.light.CreateDirectional('white',7)
directionalLight.position.set(0.5,0.5,2)

const helper = new THREE.DirectionalLightHelper(directionalLight, 1,'blue');

luisito.scene.add(helper);

/**MESH */

const geometry = new THREE.BoxGeometry(1,1,0)

geometry.setAttribute(
    'uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2)
    )

const material = new THREE.MeshStandardMaterial()

material.map = colorTexture
material.aoMap = aoTexture
material.aoMapIntensity = 1
material.displacementMap = heightTexture
material.displacementScale = 0.05
material.metalnessMap = metalTexture
material.roughnessMap = roughTexture
material.normalMap = normalTexture
material.normalScale.set(0.5,0.5)
material.transparent = true
material.alphaMap = alphaTexture

const planeMesh = luisito.mesh.CreateFromGeometry(geometry,material)
luisito.scene.add(planeMesh)
planeMesh.rotateY(0.5)
planeMesh.rotateX(-0.5)

planeMesh.position.set(0,0,-1.3)
const sueloMesh = luisito.mesh.CreateFromGeometry(

    new THREE.PlaneGeometry(2,2,1),
    new THREE.MeshStandardMaterial({color: 'white'}),


)
sueloMesh.castShadow = true
sueloMesh.receiveShadow = true

planeMesh.castShadow = true
planeMesh.receiveShadow = true

sueloMesh.position.set(0,0,-4)
luisito.update = (dt) => {
    planeMesh.rotateX(0.01)
    //planeMesh.rotateY(0.01)
    planeMesh.rotateZ(0.01)
}

directionalLight.target = planeMesh; // Establece el plano como el objetivo del directionalLight

luisito.start()