import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { SceneManager } from "./core/Scene.js";
import { Stickman } from "./core/Stickman.js";
import { PromptEngine } from "./core/PromptEngine.js";
import { Animator } from "./core/Animator.js";

let sceneManager, character, animator, promptEngine;

console.log("Starting Stickman Studio...");

async function start() {
    console.log("DOM Loaded, starting engine…");

    // 1. Initialize SceneManager first and wait for the scene to be built
    sceneManager = new SceneManager(THREE);
    await sceneManager.init(); 

    // 2. Initialize Stickman, passing the now-available scene object (Fixes TypeError)
    character = new Stickman(sceneManager.scene, THREE);

    // 3. Initialize Animator and PromptEngine
    animator = new Animator(character, THREE);
    promptEngine = new PromptEngine(animator);

    // 4. Register the animator instance with the SceneManager (Fixes "no animation seen")
    sceneManager.registerAnimator(animator); 

    setupUI();

    console.log("Stickman Studio Loaded.");
}

function setupUI() {
    const promptBox = document.getElementById("promptInput");
    const runBtn = document.getElementById("runPrompt");

    runBtn.onclick = async () => {
        const text = promptBox.value.trim();
        if (!text) return;

        const actions = await promptEngine.parse(text);
        
        // 5. Must load the timeline, then start playing (Fixes animation not running)
        animator.loadTimeline(actions); 
        animator.play();              
    };
}

window.addEventListener("DOMContentLoaded", start);
