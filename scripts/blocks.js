
import * as THREE from 'three'; 

const textureLoader = new THREE.TextureLoader();

function loadTexture(path) {
    const texture = textureLoader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    // texture.minFilter = THREE.NearestFilter;
    // texture.magFilter = THREE.NearestFilter;
    return texture;
}

const textures = {
    water: loadTexture('textures/water2.jpg'),
    grass: loadTexture('textures/grass.png'),
    stone: loadTexture('textures/stone.png')
}

export const blocks = {
    empty: {
        id: 0,
        name: 'empty',
    },
    grass: {
        id: 1,
        name: 'grass',
        color: 0x559020,
        material: new THREE.MeshLambertMaterial({map:textures.grass})
    },
    water: {
        id: 3,
        name: 'water',
        material: new THREE.MeshLambertMaterial({map:textures.water})
    },
    stone: {
        id: 4,
        name: 'stone',
        material: new THREE.MeshLambertMaterial({map:textures.stone})
    }
}

