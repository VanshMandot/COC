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
    const sun2 = new THREE.DirectionalLight();
    sun2.position.set(-220,-100,-100);
    const sun3 = new THREE.DirectionalLight();
    sun3.position.set(220,-100,-100);
    const sun4 = new THREE.DirectionalLight();
    sun4.position.set(-220,-100,100);
    scene.add(sun)
    scene.add(sun2)
    scene.add(sun3)
    scene.add(sun4)

    const ambient = new THREE.AmbientLight();
    ambient.intensity = 2;
    scene.add(ambient);
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