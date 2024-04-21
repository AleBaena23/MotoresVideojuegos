import * as THREE from 'three'
import Luisito from '../src/luisito.js';
import sources from './pruebaSources.js'

const luisito = new Luisito()
luisito.camera.instance.position.set(1,1,1);
luisito.assetManager.loadAssets(sources);

const material = new THREE.MeshStandardMaterial();
const geometry = new THREE.PlaneGeometry(1, 1, 100, 100);

geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));

const treeMesh = luisito.mesh.CreateFromGeometry(geometry, material);
treeMesh.position.x = 0;

let treeModel = null;

luisito.onAssetsLoaded = (e) => {

    // Creación de los materiales
    material.map = luisito.assetManager.get('texturaArbol01')

    // Creación del modelo
    treeModel = luisito.assetManager.get('modeloArbol01').scene
    treeModel.scale.set(0.5, 0.5, 0.5)
    treeModel.position.set(0, 0, 0)
    luisito.scene.add(treeModel)
}

// Uncaught TypeError: Cannot set properties of null (setting 'castShadow')
// at ejercicio11.js:31:22
treeModel.castShadow = true
treeModel.receiveShadow = true

const ambientLight = luisito.light.CreateAmbient('white', 1)
const directionalLight = luisito.light.CreateDirectional('white', 1)
directionalLight.position.set(5, 3, 3)

luisito.update = (dt) => {
    if (treeModel)
        treeModel.rotateY(dt)
}

luisito.start()