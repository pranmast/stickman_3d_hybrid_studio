import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { SceneManager } from "./core/Scene.js";
import { Stickman } from "./core/Stickman.js";
import { PromptEngine } from "./core/PromptEngine.js";
import { Animator } from "./core/Animator.js";

let sceneManager, character, animator, promptEngine;

console.log("Starting Stickman Studio...");

async function start() {
    console.log("DOM Loaded, starting engine…");

    sceneManager = new SceneManager(THREE);
    await sceneManager.init();

    character = new Stickman(sceneManager.scene, THREE);

    animator = new Animator(character, THREE);

    promptEngine = new PromptEngine(animator);

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
        animator.play(actions);
    };
}

// 🔥 FIX: Wait for HTML to load
window.addEventListener("DOMContentLoaded", start);
