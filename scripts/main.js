import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { World } from './world';
import {createUI} from './ui';
import { Player } from './player';
import { Physics } from './physics';

const stats = new Stats();
document.body.append(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,innerHeight);
renderer.setClearColor(0x80a0e0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const orbitCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight);
orbitCamera.position.set(100,25,250);

const controls = new OrbitControls(orbitCamera, renderer.domElement)
controls.target.set(100,10,100);
controls.update();


const scene = new THREE.Scene();
const world = new World();
world.generate();
scene.add(world);

const player = new Player(scene);
const physics = new Physics();

function setUpLights(){
    const sun = new THREE.DirectionalLight();
    sun.position.set(220,100,100);
    sun.castShadow = true;
    sun.shadow.camera.left = -200;
    sun.shadow.camera.right = 200;
    sun.shadow.camera.bottom = -200;
    sun.shadow.camera.top = 200;
    sun.shadow.camera.near = 5;
    sun.shadow.camera.far = 350;
    sun.shadow.bias = 0.0005;
    sun.shadow.mapSize = new THREE.Vector2(1024,1024);
    scene.add(sun)

    // const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
    // scene.add(shadowHelper);

    const ambient = new THREE.AmbientLight();
    ambient.intensity = 0.7;
    scene.add(ambient);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const hoverInfoDiv = document.getElementById('info');

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function detectHover() {
    raycaster.setFromCamera(mouse, orbitCamera);
    const intersects = raycaster.intersectObjects(scene.children, true); 

    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;
        const parentObject = hoveredObject.parent;

        if (parentObject && parentObject.name !== 'land') {
            hoverInfoDiv.innerHTML = `Object: ${hoveredObject.name}<br>Parent: ${parentObject.name}`;
        } else {
            hoverInfoDiv.innerHTML = ''; 
        }
    } else {
        hoverInfoDiv.innerHTML = ''; 
    }
}

let previousTime = performance.now();
function animate(){
    let currentTime = performance.now();
    let dt = (currentTime - previousTime)/1000;

    requestAnimationFrame(animate);
    player.applyInputs(dt);
    player.updateBoundsHelper();
    physics.update(player,world);
    renderer.render(scene, player.controls.isLocked ? player.camera:orbitCamera);
    stats.update();
    detectHover();

    previousTime = currentTime;
}

window.addEventListener('resize', ()=>{
    orbitCamera.aspect = window.innerWidth/window.innerHeight;
    orbitCamera.updateProjectionMatrix();
    player.camera.aspect = window.innerWidth/window.innerHeight;
    player.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
})

setUpLights();
createUI(world, player);
animate();