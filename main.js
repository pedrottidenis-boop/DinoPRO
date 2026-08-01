import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.getElementById("viewer");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b1b1b);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 1.5, 4);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);

// LUCI

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 10, 5);
scene.add(light);

// CONTROLLI

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 1;
controls.maxDistance = 10;

// CARICAMENTO MODELLO

const loader = new GLTFLoader();

loader.load(

    "./modello.glb",

    (gltf) => {

        const model = gltf.scene;

        scene.add(model);

        // centra il modello

        const box = new THREE.Box3().setFromObject(model);

        const center = box.getCenter(new THREE.Vector3());

        model.position.sub(center);

        const size = box.getSize(new THREE.Vector3());

        const maxSize = Math.max(
            size.x,
            size.y,
            size.z
        );

        camera.position.set(
            0,
            maxSize * 0.6,
            maxSize * 2
        );

        controls.target.set(0,0,0);

        controls.update();

        document
            .getElementById("loading")
            .style.display="none";

    },

    undefined,

    (error)=>{

        console.error(error);

        document
        .getElementById("loading")
        .innerHTML="Errore caricamento modello";

    }

);

// RIDIMENSIONAMENTO

window.addEventListener("resize",()=>{

camera.aspect=
window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

});

// ANIMAZIONE

function animate(){

requestAnimationFrame(animate);

controls.update();

renderer.render(
scene,
camera
);

}

animate();
