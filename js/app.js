/**
 * TerraForge v2.1 EXPANSION — Self-sufficient release
 * Self-reliant · self-expanding · self-corrective · tokenized · NFT marketplace
 * Platform fees → operator treasury wallet (Settings)
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
  [38, "Seeding Location DNA registry…"],
  [52, "Binding NFT mint & marketplace…"],
  [66, "Wiring treasury fee router…"],
  [80, "Enabling self-corrective economy…"],
  [92, "Arming frontier self-expansion…"],
  [100, "TerraForge FINAL online"],
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
      console.log(`TerraForge v2 FINAL API\n  TerraForge.sim.setTreasuryWallet(\"0xYourWallet\")\n  TerraForge.sim.claim(id)\n  TerraForge.sim.treasury`);
    },
  };
  console.log("%cTerraForge v2.0 FINAL", "color:#00f0ff;font-size:14px;font-weight:bold");
}
