export class UI {
  constructor(sim, globe) {
    this.sim = sim;
    this.selected = null;
    this.panel = document.getElementById("panel");
    this.body = document.getElementById("panelBody");
    document.querySelectorAll(".mode").forEach((button) =>
      button.addEventListener("click", () => this.open(button.dataset.mode))
    );
    document.getElementById("panelClose").onclick = () => this.panel.classList.add("hidden");
    addEventListener("terraforge:select", (event) => {
      this.selected = event.detail;
      this.open("parcel");
    });
    sim.subscribe(() => this.refreshStats());
  }

  toast(message) {
    const element = document.createElement("div");
    element.className = "toast";
    element.textContent = message;
    document.getElementById("toasts").append(element);
    setTimeout(() => element.remove(), 3200);
  }

  refreshStats() {
    const stats = this.sim.stats;
    const values = {
      terraBal: this.sim.player.terra.toFixed(1),
      energyBal: this.sim.player.energy.toFixed(0),
      statParcels: stats.parcels,
      statYield: stats.yield.toFixed(1),
      statRarity: stats.rarity,
      statEvents: stats.events,
      playerCount: "Local demo",
    };
    Object.keys(values).forEach((key) => {
      const element = document.getElementById(key);
      if (element) element.textContent = values[key];
    });
  }

  open(mode) {
    this.panel.classList.remove("hidden");
    document.querySelectorAll(".mode").forEach((button) =>
      button.classList.toggle("active", button.dataset.mode === mode)
    );
    const heading = (value) => "<h2>" + value + "</h2>";
    const button = (label, action) =>
      '<button class="btn" data-action="' + action + '">' + label + "</button>";
    let html = "";

    if (mode === "parcel" && this.selected) {
      const parcel = this.selected;
      html = heading(parcel.biome + " · Parcel") +
        '<div class="meta-grid"><div class="meta"><span class="k">Rarity</span><span class="v">' + parcel.rarity +
        '/5</span></div><div class="meta"><span class="k">Level</span><span class="v">' + parcel.level +
        '</span></div><div class="meta"><span class="k">Yield</span><span class="v">' + parcel.yield +
        '</span></div><div class="meta"><span class="k">Health</span><span class="v">' + parcel.health.toFixed(0) +
        '%</span></div></div><p>' + (parcel.owner ? "Owned in this local demo" : "Unclaimed virtual parcel") +
        '</p><div class="actions">' + (parcel.owner
          ? button("Upgrade", "upgrade") + button("Maintain", "maintain") + button("Forge collectible", "forge")
          : button("Claim · " + this.sim.config.economy.claimCost + " demo credits", "claim")) + "</div>";
    } else if (mode === "settings") {
      html = heading("PREVIEW SETTINGS") +
        "<p>All state is stored locally in this browser. There is no connected treasury, payment processor or wallet settlement.</p>";
    } else if (mode === "forge") {
      html = heading("COLLECTIBLE FORGE") +
        "<p>Create preview collectibles from parcels you control in this browser. These are not on-chain NFTs.</p>" +
        '<div class="list">' +
        (this.sim.assets.map((asset) => '<div class="list-item">' + asset.name + " <span>DEMO</span></div>").join("") ||
          "No collectibles yet.") + "</div>";
    } else if (mode === "market") {
      html = heading("MARKETPLACE PREVIEW") +
        "<p>Listings are visible only in this browser. Checkout, purchases, seller payouts and platform fees are not active.</p>" +
        '<div class="list">' +
        (this.sim.listings.map((listing) => '<div class="list-item">Asset · ' + listing.price + " demo credits</div>").join("") ||
          "No listings yet.") + "</div>";
    } else {
      html = heading(mode === "claim" ? "FRONTIER" : "LIVING WORLD") +
        "<p>Drag to orbit. Select a glowing parcel marker to inspect, claim, develop and forge a virtual collectible.</p>" +
        "<p>" + this.sim.parcels.length + " parcels · " + this.sim.assets.length + " preview collectibles</p>";
    }

    this.body.innerHTML = html;
    this.body.querySelectorAll("[data-action]").forEach((element) => {
      element.onclick = () => this.action(element.dataset.action);
    });
  }

  action(action) {
    try {
      if (!this.selected) throw Error("Select a parcel first.");
      if (action === "claim") this.sim.claim(this.selected.id);
      if (action === "upgrade") this.sim.upgrade(this.selected.id);
      if (action === "maintain") this.sim.maintain(this.selected.id);
      if (action === "forge") this.sim.forge(this.selected.id);
      this.toast("Local preview updated.");
      this.open("parcel");
    } catch (error) {
      this.toast(error.message);
    }
  }
}
