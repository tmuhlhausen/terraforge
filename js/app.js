/**
 * TerraForge v2.1 EXPANSION — Self-sufficient release
 * Virtual world simulation · collectible prototype · marketplace foundation
 * Local demo ledger only · no real payment processing
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
  [10, "Bootstrapping self-managed core…"],
  [22, "Loading spatial mesh & biomes…"],
  [38, "Generating virtual parcel registry…"],
  [52, "Preparing local collectible forge…"],
  [66, "Initializing simulated fee ledger…"],
  [80, "Loading local world economy…"],
  [92, "Preparing globe interaction…"],
  [100, "TerraForge prototype ready"],
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
  if (!sim.treasury.wallet) {
    ui.toast("Set your treasury wallet in Settings (⚙) — fees are simulated only; no funds transfer");
  } else {
    ui.toast("Treasury configured · local simulation only");
  }

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
    version: "2.1.0-expansion",
    sim,
    globe,
    ui,
    help() {
      console.log(`TerraForge v2.1 API\n  TerraForge.sim.setTreasuryWallet(\"0xYourWallet\")\n  TerraForge.sim.claim(id)\n  TerraForge.sim.treasury`);
    },
  };
  console.log("%cTerraForge v2.1 EXPANSION", "color:#00f0ff;font-size:14px;font-weight:bold");
}
