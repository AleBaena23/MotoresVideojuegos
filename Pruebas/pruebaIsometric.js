import Luisito from '../src/luisito.js'
import * as THREE from 'three'

const luisito = new Luisito()
luisito.camera.instance.position.set(100,100,100);
luisito.camera.instance.rotation.order = 'YXZ'
luisito.camera.instance.rotation.y = Math.PI / 4;
luisito.camera.instance.rotation.x = Math.atan(-1/Math.sqrt(2));
luisito.camera.instance.zoom = 20
luisito.camera.instance.updateProjectionMatrix()

const boxMesh = luisito.mesh.CreateFromGeometry(
    
new THREE.BoxGeometry(20,20,20),
new THREE.MeshBasicMaterial({color: 'crimson'})

)
  
const grid = luisito.mesh.CreateFromGeometry(
    new THREE.PlaneGeometry(100,100,10,10),
    new THREE.MeshBasicMaterial({wireframe:true})
)

grid.rotation.order = 'YXZ';
grid.rotation.y = -Math.PI / 2;
grid.rotation.x = Math.PI / 2;

luisito.update = (dt) => {
    const totalElapsed = luisito.totalElapsedInSeconds
    boxMesh.position.x = Math.cos(totalElapsed) * 20
}

luisito.start()