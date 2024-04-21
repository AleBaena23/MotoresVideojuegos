import * as THREE from 'three'
import Luisito from '../src/luisito.js';

import sources from './pruebaSources.js';

const luisito = new Luisito()
luisito.assetManager.loadAssets(sources);
luisito.camera.instance.position.set(0,0,5);


const material = new THREE.MeshStandardMaterial();
const geometry = new THREE.PlaneGeometry(15, 15, 100, 100);

geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));

const planeMesh = luisito.mesh.CreateFromGeometry(geometry, material);
planeMesh.position.set(0,0,-2);

const suelo = luisito.mesh.CreateFromGeometry(
    new THREE.PlaneGeometry(15,15,10,10),
    new THREE.MeshBasicMaterial({color: 'black'})
)
suelo.rotateX(-1.2)
suelo.position.set(0,-1.90,0)
let Fox = null;
let Duck = null;
let Silla = null;

luisito.onAssetsLoaded = (e) => {
    luisito.logger.info("Activos cargados")
    //Textura Pared
    material.map = luisito.assetManager.get('colorTexture')
    material.aoMap = luisito.assetManager.get('aoTexture')
    material.metalnessMap = luisito.assetManager.get('metalTexture')
    material.normalMap = luisito.assetManager.get('normalTexture')
    material.roughnessMap = luisito.assetManager.get('roughTexture')
   

    //Modelos
    Fox = luisito.assetManager.get('foxModel').scene
    Fox.scale.set(0.01, 0.01, 0.01)
    Fox.position.set(1, -0.25, 0)
    luisito.scene.add(Fox)

    Duck = luisito.assetManager.get('Duck').scene
    Duck.scale.set(0.5, 0.5, 0.5)
    Duck.position.set(-1, -0.22, 0)
    luisito.scene.add(Duck)

    Silla = luisito.assetManager.get('Chair').scene
    Silla.scale.set(5, 5, 5)
    Silla.position.set(0, -2, 0)
    luisito.scene.add(Silla)
    Silla.rotateX(-0.05)


}


const ambientLight = luisito.light.CreateAmbient('white', 1)
const directionalLight = luisito.light.CreateDirectional('white', 1)
directionalLight.position.set(5, 3, 3)

luisito.update = (dt) => {
    Fox.rotateY(0.02)
    Duck.rotateY(0.02)

}

luisito.start()