// core/Scene.js
// Scene manager that sets up THREE renderer, camera, and simple ground

export class SceneManager {
  constructor(canvasOrElement) {
    // If given canvas element id 'scene' (as in /index.html), use it
    this.container = (canvasOrElement instanceof HTMLCanvasElement || canvasOrElement instanceof HTMLElement)
      ? canvasOrElement
      : document.body;

    // Create renderer and attach to container if container is an HTMLElement and not a canvas element
    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this._ensureCanvas() });
    this.renderer.setSize(window.innerWidth - 320, window.innerHeight); // leave room for left panel
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, (window.innerWidth - 320) / window.innerHeight, 0.1, 2000);
    this.camera.position.set(0, 1.6, 4);

    // ambient
    const amb = new THREE.AmbientLight(0x888888);
    this.scene.add(amb);

    // directional
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(2, 4, 2);
    this.scene.add(dir);

    // ground plane
    const gmat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const ggeo = new THREE.PlaneGeometry(20, 20);
    const ground = new THREE.Mesh(ggeo, gmat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    this.scene.add(ground);

    // resize handling
    window.addEventListener("resize", () => {
      this.renderer.setSize(window.innerWidth - 320, window.innerHeight);
      this.camera.aspect = (window.innerWidth - 320) / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  _ensureCanvas() {
    // If provided a <canvas id="scene"> element, use it; else create new and append to body
    if (this.container.tagName && this.container.tagName.toLowerCase() === "canvas") {
      return this.container;
    }
    // create canvas and append to main area (example: right side)
    const canvas = document.createElement("canvas");
    canvas.id = "three-canvas";
    // If container is #scene element (in index.html earlier), append into its parent
    const sceneArea = document.getElementById("scene");
    if (sceneArea && sceneArea.tagName.toLowerCase() === "canvas") {
      // if user used a canvas with id 'scene', use it directly
      return sceneArea;
    } else {
      // otherwise append to body and set styles
      const mount = document.createElement("div");
      mount.style.flex = "1";
      mount.style.height = "100vh";
      mount.appendChild(canvas);
      document.body.appendChild(mount);
      return canvas;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
