// main.js
// Entry point: wires scene, rig, animator, prompt engine and UI together.

import { SceneManager } from "./core/Scene.js";
import { Stickman } from "./core/Stickman.js";
import { Animator } from "./core/Animator.js";
import { PromptEngine } from "./core/PromptEngine.js";
import RecordingSystem from "./core/Recording.js";
import UI from "./core/UI.js";
import CameraSystem from "./core/CameraSystem.js";

let sceneMgr, stickman, animator, promptEngine, recorder, ui, cameraSystem;

async function start() {
  // Scene + renderer
  sceneMgr = new SceneManager(document.getElementById("scene"));
  cameraSystem = new CameraSystem(sceneMgr.camera, sceneMgr.scene);

  // Rig / Actor
  stickman = new Stickman(sceneMgr.scene);
  stickman.group.position.set(0, 0, 0);

  // Animator
  animator = new Animator(stickman);

  // Prompt -> Animation generator (rules-based)
  promptEngine = new PromptEngine();

  // UI glue
  ui = new UI({
    generateFromPrompt: async (text) => {
      const timeline = promptEngine.generateTimeline(text);
      animator.loadTimeline(timeline);
      ui.updateTimeline(timeline);
    },
    play: () => animator.play(),
    pause: () => animator.pause(),
    seek: (t) => animator.seek(t),
    showPoseEditor: (s) => ui.showPoseEditor(s)
  });

  // Recording
  recorder = new RecordingSystem(sceneMgr.renderer.domElement);

  // Hook UI record/save buttons
  ui.onRecord(async () => {
    recorder.start();
    animator.play();
    await new Promise(r => setTimeout(r, (animator.duration + 0.5) * 1000));
    animator.pause();
    const blob = await recorder.stop();
    ui.showDownload(blob);
  });

  // Animation loop
  let last = performance.now();
  function loop(now) {
    const dt = (now - last) / 1000;
    last = now;
    animator.update(dt);
    cameraSystem.update(dt);
    sceneMgr.render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

start();
