import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { SceneManager } from "./core/Scene.js";
import { Stickman } from "./core/Stickman.js";
import { PromptEngine } from "./core/PromptEngine.js";
import { Animator } from "./core/Animator.js";

let sceneManager, character, animator, promptEngine;

console.log("Starting Stickman Studio...");

async function start() {
    console.log("DOM Loaded, starting engine…");

    // 1. Initialize Stickman, Animator, and PromptEngine first
    character = new Stickman(null, THREE);
    animator = new Animator(character, THREE);
    promptEngine = new PromptEngine(animator);

    // 🌟 FIX: Initialize SceneManager and pass the animator
    sceneManager = new SceneManager(THREE, animator); // <-- PASS ANIMATOR HERE
    await sceneManager.init();

    // Re-assign character scene reference now that SceneManager is initialized
    character.scene = sceneManager.scene; // Ensure character is in the scene

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
        
        // 🌟 FIX 3: Must load the timeline, then start playing.
        animator.loadTimeline(actions); 
        animator.play();              
    };
}

// 🔥 FIX: Wait for HTML to load
window.addEventListener("DOMContentLoaded", start);
