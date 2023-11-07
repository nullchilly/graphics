import {
  AxesHelper,
	BufferGeometry,
	Color,
	ConeGeometry,
	CylinderGeometry,
	DirectionalLight,
	DoubleSide,
	Float32BufferAttribute,
	Group,
	LineSegments,
	LineBasicMaterial,
	Mesh,
	MeshPhongMaterial,
	PerspectiveCamera,
	Scene,
	WireframeGeometry,
	WebGLRenderer
} from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const twoPi = Math.PI * 2;

function updateGroupGeometry( mesh, geometry ) {

	mesh.children[ 0 ].geometry.dispose();
	mesh.children[ 1 ].geometry.dispose();

	mesh.children[ 0 ].geometry = new WireframeGeometry( geometry );
	mesh.children[ 1 ].geometry = geometry;

}


function createCylinderGeometry( mesh ) {
  const data = {
    radiusTop: 5,
    radiusBottom: 5,
    height: 10,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: twoPi
  };

  function generateGeometry() {

    updateGroupGeometry( mesh,
      new CylinderGeometry(
        data.radiusTop,
        data.radiusBottom,
        data.height,
        data.radialSegments,
        data.heightSegments,
        data.openEnded,
        data.thetaStart,
        data.thetaLength
      )
    );

  }

  const folder = gui.addFolder( 'THREE.CylinderGeometry' );

  folder.add( data, 'radiusTop', 0, 30 ).onChange( generateGeometry );
  folder.add( data, 'radiusBottom', 0, 30 ).onChange( generateGeometry );
  folder.add( data, 'height', 1, 50 ).onChange( generateGeometry );
  folder.add( data, 'radialSegments', 3, 64 ).step( 1 ).onChange( generateGeometry );
  folder.add( data, 'heightSegments', 1, 64 ).step( 1 ).onChange( generateGeometry );
  folder.add( data, 'openEnded' ).onChange( generateGeometry );
  folder.add( data, 'thetaStart', 0, twoPi ).onChange( generateGeometry );
  folder.add( data, 'thetaLength', 0, twoPi ).onChange( generateGeometry );


  generateGeometry();

}
const gui = new GUI();

const scene = new Scene();
scene.background = new Color( 0x444444 );

const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
camera.position.z = 30;

const renderer = new WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const orbit = new OrbitControls( camera, renderer.domElement );
orbit.enableZoom = false;

const lights = [];
lights[ 0 ] = new DirectionalLight( 0xffffff, 3 );
lights[ 1 ] = new DirectionalLight( 0xffffff, 3 );
lights[ 2 ] = new DirectionalLight( 0xffffff, 3 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

const group = new Group();

const geometry = new BufferGeometry();
geometry.setAttribute( 'position', new Float32BufferAttribute( [], 3 ) );

const lineMaterial = new LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
const meshMaterial = new MeshPhongMaterial( { wireframe: false, color: 0x156289, emissive: 0x072534, side: DoubleSide, flatShading: true } );

function toggleWireFrame(obj){
     var f = function(obj2)
     {
         if(obj2.hasOwnProperty("material")){
           obj2.material.wireframe=!obj2.material.wireframe;
         }          
     }
     obj.traverse(f);   
 }
const wiredata= {wireframe: false}
gui.addFolder('Mesh').add( wiredata, 'wireframe').onChange( () => {
  toggleWireFrame(group)
});

group.add( new LineSegments( geometry, lineMaterial ) );
group.add( new Mesh( geometry, meshMaterial ) );

// chooseFromHash( group );
createCylinderGeometry( group );

scene.add( group );

var data= { axes: false }
gui.addFolder( 'Util' ).add( data, 'axes').onChange( () => {
  
  scene.add( new AxesHelper( 20 ) );
});
function render() {

	requestAnimationFrame( render );

	renderer.render( scene, camera );

}

window.addEventListener( 'resize', function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}, false );
window.addEventListener( 'mousewheel', (event) => {
    camera.position.z +=event.deltaY/500;
});
render();

