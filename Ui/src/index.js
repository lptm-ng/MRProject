import * as THREE from 'three';


import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import ThreeMeshUI from 'three-mesh-ui';

import VRControl from '../utils/VRControl.js';
import ShadowedLight from '../utils/ShadowedLight.js';
import FontJSON from '../dist/assets/Roboto-msdf.json';
import FontImage from '../dist/assets/Roboto-msdf.png';
import Largemap from '../src/Large.png';
import Middlemap from '../src/Middle.png';
import Smallmap from '../src/Small.png';



let scene, camera, renderer, controls, vrControl; 
let meshContainer, meshes, currentMesh;
const objsToTest = [];
let mode = "L";


window.addEventListener('load', init);
window.addEventListener('resize', onWindowResize);

// compute mouse position in normalized device coordinates
// (-1 to +1) for both directions.
// Used to raycasting against the interactive elements

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();
mouse.x = mouse.y = null;

let selectState = false;
let selectedObject = null;

window.addEventListener('pointermove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('pointerdown', () => {
    selectState = true;
});

window.addEventListener('pointerup', () => {
    selectState = false;
});

window.addEventListener('touchstart', (event) => {
    selectState = true;
    mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('touchend', () => {
    selectState = false;
    mouse.x = null;
    mouse.y = null;
});

//

function init() {

    ////////////////////////
    //  Basic Three Setup
    ////////////////////////

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);

    // Orbit controls for no-vr
    controls = new OrbitControls(camera, renderer.domElement);
    camera.position.set(0, 1.6, 0);
    controls.target = new THREE.Vector3(0, 1, -1.8);

    /////////
    // Room
    /////////

    const room = new THREE.LineSegments(
        new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
        new THREE.LineBasicMaterial({ color: 0x808080 })
    );

    const roomMesh = new THREE.Mesh(
        new THREE.BoxGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
        new THREE.MeshBasicMaterial({ side: THREE.BackSide })
    );

    scene.add(room);
    objsToTest.push(roomMesh);

    //////////
    // Light
    //////////

    const light = ShadowedLight({
        z: 10,
        width: 6,
        bias: -0.0001
    });

    const hemLight = new THREE.HemisphereLight(0x808080, 0x606060);

    scene.add(light, hemLight);



    

    vrControl = VRControl(renderer, camera, scene);

    scene.add(vrControl.controllerGrips[0], vrControl.controllers[0]);

    vrControl.controllers[0].addEventListener('selectstart', () => {

        selectState = true;

    });
    vrControl.controllers[0].addEventListener('selectend', () => {

        selectState = false;

    });


    

    ////////////////////
    // Primitive Meshes
    ////////////////////

    meshContainer = new THREE.Group();
    meshContainer.position.set(0, 1, -1.9);
    scene.add(meshContainer);

    //

    
    const LargeimageBlock = new ThreeMeshUI.Block({
        height: 1,
        width: 1,
      });

    const loader = new THREE.TextureLoader();

    loader.load(Largemap, (texture) => {
    LargeimageBlock.set({ backgroundTexture: texture });
  });
    

    const MedeumimageBlock = new ThreeMeshUI.Block({
        height: 6/7, // 6/7 ist dase Verhältnis von Medium zu Large
        width: 6/7,
      });

    loader.load(Middlemap, (texture) => {
    MedeumimageBlock.set({ backgroundTexture: texture });
  });

    const SmallimageBlock = new ThreeMeshUI.Block({
        height: 5/7, // 6/7 ist dase Verhältnis von Large zu Small
        width: 5/7,
      });

    loader.load(Smallmap, (texture) => {
    SmallimageBlock.set({ backgroundTexture: texture });
  });

    LargeimageBlock.visible = MedeumimageBlock.visible = SmallimageBlock.visible = false;

    meshContainer.add(LargeimageBlock, MedeumimageBlock, SmallimageBlock);

    meshes = [LargeimageBlock, MedeumimageBlock, SmallimageBlock];
    currentMesh = 0;

    showMesh(currentMesh);

    

    //////////
    // Panel
    //////////

    makePanel();

    //

    renderer.setAnimationLoop(loop);

}

// Shows the primitive mesh with the passed ID and hide the others

function showMesh(id) {

    meshes.forEach((mesh, i) => {

        mesh.visible = i === id ? true : false;

    });

}

///////////////////
// UI contruction
///////////////////

function makePanel() {

    // Container block, in which we put the two buttons.
    // We don't define width and height, it will be set automatically from the children's dimensions
    // Note that we set contentDirection: "row-reverse", in order to orient the buttons horizontally

    const container = new ThreeMeshUI.Block({
        justifyContent: 'center',
        contentDirection: 'column',
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontSize: 0.07,
        padding: 0.02,
        borderRadius: 0.031,
        //backgroundOpacity: 0
    });

    container.position.set(0, 0.6, -1.2);
    container.rotation.x = -0.55;
    scene.add(container);

    const ImageContainer = new ThreeMeshUI.Block({
        justifyContent: 'center',
        contentDirection: 'column',
        fontFamily: FontJSON,
        fontTexture: FontImage,
        fontSize: 0.07,
        padding: 0.02,
        borderRadius: 0.031,
        //backgroundOpacity: 0
    });

    const textBlock = new ThreeMeshUI.Block({
        height: 0.1,
        width: 0.8,
        justifyContent: 'center',
        offset: 0.01, // distance separating the inner block from its parent
        backgroundOpacity: 0
    });

    container.add(textBlock);

    const trennLine = new ThreeMeshUI.Block({
        height: 0.012,
        width: 0.9,
        justifyContent: 'center',
        offset: 0.01, // distance separating the inner block from its parent
        backgroundOpacity: 1,
        borderRadius: 0.006
    });

    container.add(trennLine);

    const instructionsTextBlock = new ThreeMeshUI.Block({
        height: 0.2,
        width: 0.9,
        justifyContent: 'center',
        offset: 0.01, // distance separating the inner block from its parent
        backgroundOpacity: 0
    });


    container.add(instructionsTextBlock);

    const text = new ThreeMeshUI.Text({
        content: 'Welcome to KrarioMart',
        textAlign: 'center',
        padding: 0.05,
    });

    textBlock.add(text)

    const instructionsText = new ThreeMeshUI.Text({
        content: 'Please select a Racetrack, you want to drive on',
        textAlign: 'center',
        fontSize: 0.05,
    })

    instructionsTextBlock.add(instructionsText)

    /*textBlock.add( new ThreeMeshUI.Text({
        content: 'please select "AR" or "VR" to start',
        textAlign: 'center',
        fontSize: 0.05,
        padding: 0.05
    }))
     BUTTONS*/

    // We start by creating objects containing options that we will use with the two buttons,
    // in order to write less code.

    const buttonOptions = {
        width: 0.4,
        height: 0.15,
        justifyContent: 'center',
        offset: 0.05,
        margin: 0.02,
        borderRadius: 0.075
    };

    // Options for component.setupState().
    // It must contain a 'state' parameter, which you will refer to with component.setState( 'name-of-the-state' ).

    const hoveredStateAttributes = {
        state: 'hovered',
        attributes: {
            offset: 0.035,
            backgroundColor: new THREE.Color(0x999999),
            backgroundOpacity: 1,
            fontColor: new THREE.Color(0xffffff)
        },
    };

    const idleStateAttributes = {
        state: 'idle',
        attributes: {
            offset: 0.035,
            backgroundColor: new THREE.Color(0x666666),
            backgroundOpacity: 0.3,
            fontColor: new THREE.Color(0xffffff)
        },
    };

    // Buttons creation, with the options objects passed in parameters.

    const buttonNext = new ThreeMeshUI.Block(buttonOptions);
    const buttonPrevious = new ThreeMeshUI.Block(buttonOptions);
    const buttonStart = new ThreeMeshUI.Block(buttonOptions);

    // Add text to buttons

    buttonNext.add(
        new ThreeMeshUI.Text({ content: 'next' })
    );

    buttonPrevious.add(
        new ThreeMeshUI.Text({ content: "previous" })
    );

    buttonStart.add(
        new ThreeMeshUI.Text({ content: 'start' })
    );

    // Create states for the buttons.
    // In the loop, we will call component.setState( 'state-name' ) when mouse hover or click

    const selectedAttributes = {
        offset: 0.02,
        backgroundColor: new THREE.Color(0x777777),
        fontColor: new THREE.Color(0x222222)
    };

    buttonNext.setupState({
        state: 'selected',
        attributes: selectedAttributes,
        onSet: () => {
        selectedObject = buttonNext
        currentMesh += 1;
        if (currentMesh > 2) currentMesh = 0;
        showMesh(currentMesh);
        
        }
    });
    buttonNext.setupState(hoveredStateAttributes);
    buttonNext.setupState(idleStateAttributes);

    //

    buttonPrevious.setupState({
        state: 'selected',
        attributes: selectedAttributes,
        onSet: () => {
            selectedObject = buttonPrevious
            currentMesh -= 1;
            if (currentMesh < 0) currentMesh = 2;
            showMesh(currentMesh);

        }
    });
    buttonPrevious.setupState(hoveredStateAttributes);
    buttonPrevious.setupState(idleStateAttributes);

    buttonStart.setupState({
        state: 'selected',
        attributes: selectedAttributes,
        onSet: () => {
            selectedObject = buttonStart
            zeigeIframeAlt();
        }
    });
    buttonStart.setupState(hoveredStateAttributes);
    buttonStart.setupState(idleStateAttributes);

    // Add buttons to the container
    container.add(buttonStart, buttonNext, buttonPrevious);
    objsToTest.push(buttonStart, buttonNext, buttonPrevious);

}

// Handle resizing the viewport

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

//

function loop() {

    // Don't forget, ThreeMeshUI must be updated manually.
    // This has been introduced in version 3.0.0 in order
    // to improve performance
    ThreeMeshUI.update();

    controls.update();

    meshContainer.rotation.z += 0.002;

    renderer.render(scene, camera);

    updateButtons();

}

// Called in the loop, get intersection with either the mouse or the VR controllers,
// then update the buttons states according to result

function updateButtons() {

    // Find closest intersecting object

    let intersect;

    if (renderer.xr.isPresenting) {

        vrControl.setFromController(0, raycaster.ray);

        intersect = raycast();

        // Position the little white dot at the end of the controller pointing ray
        if (intersect) vrControl.setPointerAt(0, intersect.point);

    } else if (mouse.x !== null && mouse.y !== null) {

        raycaster.setFromCamera(mouse, camera);

        intersect = raycast();

    }

    // Update targeted button state (if any)
     if (intersect && intersect.object.isUI) {
        if (selectState) {
            intersect.object.setState('selected');
        } else {
            intersect.object.setState('hovered');
        }
        selectedObject = intersect.object
    }


    // Update non-targeted buttons state

    objsToTest.forEach((obj) => {

        if ( (!intersect || obj !== intersect.object) && obj.isUI ) {

            // Component.setState internally call component.set with the options you defined in component.setupState
            obj.setState( 'idle' );
        }

    } );

}


function zeigeIframeAlt() {
    

    if (currentMesh == 1) {
        mode = "M";
    } else if (currentMesh == 2) {
        mode = "S";
    } else {
        mode = "L"; //default 
    }
    let targetURL = "https://erpsee.github.io/MRTest/Ui/src/car_test.html";
        targetURL += "?mode=" + mode;
    window.location.href = targetURL;
}


//

function raycast() {

    return objsToTest.reduce((closestIntersection, obj) => {

        const intersection = raycaster.intersectObject(obj, true);

        if (!intersection[0]) return closestIntersection;

        if (!closestIntersection || intersection[0].distance < closestIntersection.distance) {

            intersection[0].object = obj;

            return intersection[0];

        }

        return closestIntersection;

    }, null);

}