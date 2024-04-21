import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/*
    Atención, se debe llamar al asset manager antes de luisito.start
*/

export default class AssetManager extends THREE.EventDispatcher
{
    constructor(luisito)
    {
        super()

        // Crea la escena partiendo de Luisito, importa el loader y asignamos valores para empezar a trabajar.
        this.scene = luisito.scene;
        this.logger = luisito.logger;
        this.logger.info("Llamando al Asset Manager");

        this.assets = {};
        this.toLoad = 0;
        this.loaded = 0;
        this.assetsReady = false;

        this.loaders = {};
        this.loaders.GLTFLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
    }

    // Este método se come la lista de modelos y texturas, ve de qué tipo es cada uno y se va a su path y carga el elemento.
    loadAssets(sources) 
    {
        this.toLoad = sources.length;
        for(const source of sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loaders.GLTFLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file);
                    }
                )
            }

            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file);
                    }
                )

            }
        }
    }

    // Esto accede a la propiedad "name" de la lista de modelos del modelo a cargar y lo devuelve, fin.
    get(name) 
    {
        return this.assets[name];
    }

    // Esto comprueba si se ha cargado el elemento y manda un aviso al sistema de eventos.
    sourceLoaded(source, file) {
        this.assets[source.name] = file;
        this.loaded++;
    
        if (this.loaded === this.toLoad) {
            this.assetsReady = true;
            this.dispatchEvent({
                type: 'ready',
                totalAssets: this.loaded,
                assets: this.assets 
            }); // Dispara el evento 'ready'
        }
    }
    
}