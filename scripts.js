import * as THREE from 'https://cdn.skypack.dev/three@0.133.0/build/three.module.js';
import Forces from './forces';
import './style.css'
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.133.0/examples/jsm/loaders/GLTFLoader.js';
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl';
import Stats from 'three/examples/jsm/libs/stats.module.js';



// Check for compilation errors

// Your event handling code here
const scene = new THREE.Scene();
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, -2);
scene.add(directionalLight);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(0, 2, 2);
scene.add(directionalLight2);

// const spotlight = new THREE.SpotLight(0xffffff, 1);
// spotlight.position.set(0, 1, 1);
// scene.add(spotlight);
const gui = new dat.GUI();
const debugObject = {}

const sizes = {
    height: window.innerHeight,
    width: window.innerWidth

}
const coursor = {
    x: 0,
    y: 0,
    z: 0
}

window.addEventListener('mousemove', (event) => {

    coursor.x = event.clientX / sizes.width - 0.5,
        coursor.y = -(event.clientY / sizes.height - 0.5)


});

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const texturePaths = [

    '/models/boat_a/textures/01_-_Default_baseColor.png',
    '/models/boat_a/textures/01_-_Default_metallicRoughness.png',
    '/models/boat_a/textures/01_-_Default_normal.png'
];
let texturesLoaded = 0;

let model3d;

const constant = new Forces();

await gltfLoader.loadAsync('/models/boat_a/scene.gltf').then((gltf) => {
    const model = gltf.scene;
    model.scale.multiplyScalar(1 / 1000);
    scene.add(gltf.scene)

    model3d = model;
    // Create an array of promises for loading textures





});



const textureloader = new THREE.TextureLoader();

const sandtexture = textureloader.load('./textures/door/sky.png', function(texture) {
    texture.flipX = false; // Flip the texture vertically
    texture.needsUpdate = true;
});


const sandtextureNormal = textureloader.load('./textures/door/images')

const waterGeometry = new THREE.PlaneGeometry(100, 100, 1024, 1024);
const SandGeometry = new THREE.PlaneGeometry(50, 50, 32, 32);
const SandMaterial = new THREE.MeshBasicMaterial({
    map: sandtexture,
    toneMapped: false,



});
const Sand = new THREE.Mesh(SandGeometry, SandMaterial);
Sand.position.z = 50;



Sand.rotation.x = Math.PI * -0.5;
scene.add(Sand);
debugObject.depthColor = '#186691';
debugObject.surfaceColor = '#9bd8ff';
const waterMaterial = new THREE.ShaderMaterial({

    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    depthWrite: true,
    uniforms: {
        uTime: { value: 0 },
        uBigWavesElevation: { value: 0.2 },
        uBigWavesSpeed: { value: 0 },

        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIterations: { value: 4.0 },

        uBigWavesFrequency: {
            value: new THREE.Vector2(0, 0)
        },
        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.3 },
        uColorMultiplier: { value: 1.9 },
    },

    //side: THREE.DoubleSide,

});



// // Assuming you have a function to generate Value Noise
var dt = 0.1;
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0.2).max(1).step(0.001).name('uBigWavesElevation');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFreqencyX');;
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFreqencyY');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed');
//gui.addColor(debugObject, 'depthColor').name('depthColor').onChange(() => { waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor) });
//gui.addColor(debugObject, 'surfaceColor').name('surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) });

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset');
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier');

//gui.add(dt).min(0).max(1).step(0.001).name('deltaTime');

const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
water.position.set(0, 0, 0);
scene.add(water);


function createMaterialArray(imagePrefix) {
    const urls = [
        imagePrefix + 'Daylight Box_Right.jpg', imagePrefix + 'Daylight Box_Left.jpg',
        imagePrefix + 'Daylight Box_Top.jpg', imagePrefix + 'Daylight Box_Bottom.jpg',
        imagePrefix + 'Daylight Box_Front.jpg', imagePrefix + 'Daylight Box_Back.jpg'
    ];




    return urls
}


const loader = new THREE.CubeTextureLoader();
scene.background = loader.load(createMaterialArray);
const urls = createMaterialArray('./textures/door/images/');
loader.load(urls, function(textureCube) {
    scene.background = textureCube;
});




//camera
const canvas = document.querySelector('.webgl')
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.set(0, 0.1, 3);
scene.add(camera);
const control = new OrbitControls(camera, canvas)

//control.enableZoom = true;
//control.minDistance = 1;
//control.maxDistance = 2;
//control.minPolarAngle = Math.PI / 2;
//control.maxPolarAngle = Math.PI / 2;
//control.target.set(1, 1, 0);

//Renderer

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performance'
});



renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio));


const clock = new THREE.Clock()
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkiteFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkiteRequestFullscreen) {
            canvas.webkiteRequestFullscreen
        }




    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkiteExitFullscreen) {
            document.webkiteExitFullscreen()
        }
    }
})

window.addEventListener(
    'resize',
    () => {
        sizes.height = window.innerHeight,
            sizes.width = window.innerWidth

        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1, 1000))
    }

);


const tick = () => {
    stats.begin();
    const elapsedTime = clock.getElapsedTime()
        //waterMaterial.displacementScale = Math.sin(Date.now() * 0.001) * 0.1;


    //water
    waterMaterial.uniforms.uTime.value = elapsedTime;

    renderer.render(scene, camera)



    window.requestAnimationFrame(tick)
    stats.end();
}
tick();