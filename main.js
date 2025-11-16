import { SceneManager } from "./core/Scene.js";
import { Stickman } from "./core/Stickman.js";
import { PromptEngine } from "./core/PromptEngine.js";
import { Animator } from "./core/Animator.js";

let sceneManager;
let character;
let animator;
let promptEngine;

async function start() {

    // 1️⃣ Create the scene manager FIRST
    sceneManager = new SceneManager();
    await sceneManager.init();  // sets up Three.js, camera, lights, renderer

    // 2️⃣ Create the stickman AFTER the scene exists
    character = new Stickman(sceneManager.scene, {
        color: 0xffffff,
        size: 1,
        gender: "neutral"
    });

    // 3️⃣ Animation engine
    animator = new Animator(character);

    // 4️⃣ Prompt → animation engine
    promptEngine = new PromptEngine(animator);

    // 5️⃣ Attach UI events
    setupUI();

    console.log("Stickman Studio Loaded.");
}

function setupUI() {
    const promptBox = document.getElementById("promptInput");
    const runBtn = document.getElementById("runPrompt");

    runBtn.onclick = async () => {
        const text = promptBox.value.trim();
        if (text.length === 0) return;

        const actions = await promptEngine.parse(text);
        animator.play(actions);
    };
}

// Start app on load
start();
