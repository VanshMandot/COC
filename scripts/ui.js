import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export function createUI(world,player){
    const gui = new GUI();

    gui.add(player,'maxSpeed', 10,20).name('Max Speed');
    gui.add(world.size, 'width',8,500,1).name('Width');

    gui.onChange(()=>{
        world.generate();
    })
}