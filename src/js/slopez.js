import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add the orbit controls to the camera
const controls = new OrbitControls(camera, renderer.domElement);

// Set up the axes
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// Ask the user for the equation in the form of a string
graph(prompt("Enter the equation in the form 'dy/dx = ...'"));

function graph(equationString) {
  if (equationString !== "") {
    const equation = new Function('x', 'y', `return ${equationString}`);
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const size = 200;
    const segments = 400;
    const step = size * 2 / segments;
    const halfSize = size / 2;
    for (let x = -halfSize; x < halfSize; x += step) {
      for (let y = -halfSize; y < halfSize; y += step) {
        const z = equation(x, y);
        vertices.push(x, y, z);
        const color = new THREE.Color();
        color.setHSL(z/1000, 1, 0.5);
        colors.push(color.r, color.g, color.b);
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.5, vertexColors: true });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
  } else {
    console.log("Equation string cannot be empty.");
  }
}

const axisLength = 50;
const axisSpacing = 1;

const xGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-axisLength, 0, 0),
  new THREE.Vector3(axisLength, 0, 0)
]);
const yGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, -axisLength, 0),
  new THREE.Vector3(0, axisLength, 0)
]);
const zGeometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, 0, -10000),
  new THREE.Vector3(0, 0, 10000)
]);

const xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const zMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

for (let i = -axisLength; i <= axisLength; i += axisSpacing) {
  const xLine = new THREE.Line(xGeometry, xMaterial);
  xLine.position.x = i;
  scene.add(xLine);

  const yLine = new THREE.Line(yGeometry, yMaterial);
  yLine.position.y = i;
  scene.add(yLine);
}

const zLine = new THREE.Line(zGeometry, zMaterial);
scene.add(zLine);

// Render the scene
function animate() {
  requestAnimationFrame(animate);

  // Rotate the camera based on mouse input
  controls.update();

  renderer.render(scene, camera);
}
animate();