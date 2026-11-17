/**
 * TerraForge v2.2 — commercial platform preview
 * Local virtual-world simulation only. No real payments or NFT minting.
 */
import { TerraSim } from "./sim.js";
import { GlobeView } from "./globe.js";
import { UI } from "./ui.js";

const bootStatus = document.getElementById("bootStatus");
const bootFill = document.getElementById("bootFill");
const enterBtn = document.getElementById("enterBtn");
const boot = document.getElementById("boot");
const hud = document.getElementById("hud");

const stages = [
  [10, "Bootstrapping preview…"],
  [22, "Loading spatial mesh & biomes…"],
  [38, "Generating virtual parcel registry…"],
  [52, "Preparing local collectible forge…"],
  [66, "Initializing demo economy…"],
  [80, "Loading local world state…"],
  [92, "Preparing globe interaction…"],
  [100, "TerraForge preview ready"],
];

async function bootSequence() {
  for (const [pct, msg] of stages) {
    bootFill.style.width = pct + "%";
    bootStatus.textContent = msg;
    await wait(220 + Math.random() * 160);
  }
  enterBtn.classList.remove("hidden");
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

enterBtn.addEventListener("click", () => {
  boot.classList.add("hidden");
  hud.classList.remove("hidden");
  startApp();
});

bootSequence();

function startApp() {
  const sim = new TerraSim();
  const canvas = document.getElementById("globe");
  const globe = new GlobeView(canvas, sim);
  const ui = new UI(sim, globe);

  ui.refreshStats();
  ui.toast("Preview mode: progress is stored only in this browser. No purchases, transfers or NFTs are active.");

  setInterval(() => sim.step(), 900);

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    globe.render(dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.TerraForge = {
    version: "2.2.0-preview",
    sim,
    globe,
    ui,
    help() {
      console.log("TerraForge preview API: local simulation only; no production services are connected.");
    },
  };
  console.log("%cTerraForge v2.2 PREVIEW", "color:#00f0ff;font-size:14px;font-weight:bold");
}
