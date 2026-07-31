import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b1b1b);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(2, 2, 5);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document
    .getElementById("viewer")
    .appendChild(renderer.domElement);

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

const hemi = new THREE.HemisphereLight(
    0xffffff,
    0x444444,
    2
);

scene.add(hemi);

const dir = new THREE.DirectionalLight(
    0xffffff,
    2
);

dir.position.set(5, 8, 5);

scene.add(dir);

const loader = new GLTFLoader();

let dinosaur = null;

loader.load(

    "modello.glb",

    function(gltf){

        dinosaur = gltf.scene;

        scene.add(dinosaur);

        document
            .getElementById("loading")
            .style.display = "none";

        createHotspots();

    },

    undefined,

    function(error){

        console.error(error);

    }

);

const infoPanel = document.getElementById("infoPanel");
const title = document.getElementById("title");
const description = document.getElementById("description");

function showInfo(nome,testo){

    title.textContent = nome;

    description.textContent = testo;

    infoPanel.classList.remove("hidden");

}

document
.getElementById("closeBtn")
.onclick = ()=>{

    infoPanel.classList.add("hidden");

};

const hotspotData = [

{
name:"Testa",

position:new THREE.Vector3(0,1.3,1.4),

text:
`La testa del dinosauro ospitava
una potente mascella.

Lunghezza:
1 metro

Peso stimato:
2500 kg

Alimentazione:
Carnivoro`

},

{
name:"Spine dorsali",

position:new THREE.Vector3(0,1.7,0),

text:
`Le spine dorsali potevano
servire per difesa,
termoregolazione
oppure comunicazione.`

},
  {
name:"Zampa anteriore",

position:new THREE.Vector3(
0.6,
0.4,
0.8
),

text:
`Le zampe anteriori erano
utilizzate per mantenere
l'equilibrio.

Lunghezza:
80 cm`

},

{
name:"Zampa posteriore",

position:new THREE.Vector3(
0.6,
0.2,
-0.8
),

text:
`Le zampe posteriori erano
molto robuste.

Velocità stimata:
40 km/h`

},

{
name:"Coda",

position:new THREE.Vector3(
0,
0.9,
-2
),

text:
`La lunga coda aiutava
a mantenere l'equilibrio.

Lunghezza:
4 metri`

}

];

const hotspots = [];

function createHotspots(){

    hotspotData.forEach((item)=>{

        const sphere =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.05,
                16,
                16
            ),

            new THREE.MeshBasicMaterial({

                color:0xff3333

            })

        );

        sphere.position.copy(item.position);

        sphere.userData=item;

        scene.add(sphere);

        hotspots.push(sphere);

    });

}

const raycaster =
new THREE.Raycaster();

const mouse =
new THREE.Vector2();

window.addEventListener(

"pointerdown",

(event)=>{

mouse.x =
(event.clientX/window.innerWidth)
*2-1;

mouse.y =
-(event.clientY/window.innerHeight)
*2+1;

raycaster.setFromCamera(
mouse,
camera
);

const hit =
raycaster.intersectObjects(
hotspots
);

if(hit.length){

const data=
hit[0].object.userData;

moveCamera(data.position);

showInfo(
data.name,
data.text
);

}

}

);
// ===============================
// Movimento telecamera
// ===============================

let cameraTarget = new THREE.Vector3(2, 2, 5);
let controlsTarget = new THREE.Vector3(0, 0, 0);

function moveCamera(targetPosition){

    const direction = new THREE.Vector3(
        1.2,
        0.8,
        1.8
    );

    cameraTarget = targetPosition.clone().add(direction);

    controlsTarget = targetPosition.clone();

}

document
.getElementById("resetCamera")
.addEventListener("click",()=>{

    cameraTarget.set(
        2,
        2,
        5
    );

    controlsTarget.set(
        0,
        0,
        0
    );

    infoPanel.classList.add("hidden");

});


// ===============================
// Animazione
// ===============================

function animate(){

    requestAnimationFrame(
        animate
    );

    camera.position.lerp(
        cameraTarget,
        0.05
    );

    controls.target.lerp(
        controlsTarget,
        0.05
    );

    controls.update();

    renderer.render(
        scene,
        camera
    );

}

animate();


// ===============================
// Resize finestra
// ===============================

window.addEventListener(
"resize",
()=>{

camera.aspect =
window.innerWidth /
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

});


// ===============================
// Rotazione automatica iniziale
// ===============================

let autoRotate = true;

controls.addEventListener(
"start",
()=>{

autoRotate = false;

});

setInterval(()=>{

    if(
        autoRotate &&
        dinosaur
    ){

        dinosaur.rotation.y += 0.003;

    }

},16);
