import * as THREE from 'three'
import Luisito from '/src/luisito.js';

const luisito = new Luisito

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
const directionalLight = luisito.light.CreateDirectional('white',1)
directionalLight.position.set(5,3,3)


/**MESH */

const geometry = new THREE.PlaneGeometry(1,1,100,100)

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

luisito.update = (dt) => {
    //planeMesh.rotateX(0.01)
    //planeMesh.rotateY(0.01)
    planeMesh.rotateZ(0.01)
}

luisito.start()