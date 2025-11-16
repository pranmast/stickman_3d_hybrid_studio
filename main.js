import { SceneManager } from "./core/Scene.js";
import { Stickman } from "./core/Stickman.js";
import { PromptEngine } from "./core/PromptEngine.js";
import { Animator } from "./core/Animator.js";

let sceneManager;
let stickman;
let animator;
let promptEngine;

async function start() {

    console.log("Starting Stickman Studio...");

    // 1️⃣ Create the 3D scene environment
    sceneManager = new SceneManager();
    await sceneManager.init();   // ensures THREE is loaded + scene, camera, lights, renderer

    // 2️⃣ Create the stickman (MUST pass 'scene', not 'sceneManager.scene')
    stickman = new Stickman({
        scene: sceneManager.scene,   // correct constructor shape
        color: 0xffffff,
        size: 1,
        gender: "neutral"
    });

    // Add stickman to the 3D scene
    sceneManager.add(stickman.group);  // stickman.group MUST exist

    // 3️⃣ Animation system
    animator = new Animator(stickman);

    // 4️⃣ Prompt engine
    promptEngine = new PromptEngine(animator);

    // 5️⃣ Hook UI buttons / prompt input
    setupUI();

    console.log("Stickman Studio Loaded ✔");
}

function setupUI() {
    const promptBox = document.getElementById("promptInput");
    const runBtn = document.getElementById("runPrompt");

    runBtn.onclick = async () => {
        const text = promptBox.value.trim();
        if (!text) return;

        const actions = await promptEngine.parse(text);
        animator.play(actions);
    };
}

// Start application
start();
