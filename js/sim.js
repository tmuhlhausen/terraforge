import { loadConfig, saveConfig } from "./config.js";
const KEY="terraforge_state_v3";
const uid=()=>crypto.randomUUID?.()||("asset-"+Date.now()+"-"+Math.random());
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
export class TerraSim{
 constructor(){this.config=loadConfig();this.listeners=new Set();this.state=this.read();this.treasury={wallet:this.config.treasuryWallet||"",collected:this.state.fees||0};if(!this.state.parcels.length)this.seed();}
 read(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s?.version===3)return s;}catch{}return {version:3,player:{terra:500,energy:100,xp:0},parcels:[],assets:[],listings:[],events:[],fees:0};}
 persist(){this.state.fees=this.treasury.collected;try{localStorage.setItem(KEY,JSON.stringify(this.state));}catch(e){console.warn("Local save unavailable",e);}}
 emit(type,payload={}){this.persist();this.listeners.forEach(fn=>fn({type,payload}));}
 subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
 seed(){for(let i=0;i<36;i++)this.state.parcels.push({id:uid(),lat:Math.asin(2*(i+.5)/36-1)*180/Math.PI,lon:(i*137.508)%360-180,biome:["Verdant","Tundra","Azure","Obsidian"][i%4],rarity:1+i%5,level:1,owner:null,yield:1.8+i%4*.3,health:100});this.persist();}
 get parcels(){return this.state.parcels} get assets(){return this.state.assets} get listings(){return this.state.listings} get player(){return this.state.player}
 get stats(){const a=this.parcels.filter(p=>p.owner==="you");return {parcels:a.length,yield:a.reduce((n,p)=>n+p.yield*p.health/100,0),rarity:a.reduce((n,p)=>n+p.rarity,0),events:this.state.events.length};}
 setTreasuryWallet(w){if(!/^0x[a-fA-F0-9]{40}$/.test(w))throw Error("Enter a valid EVM wallet address.");this.treasury.wallet=w;this.config.treasuryWallet=w;saveConfig(this.config);this.emit("treasury");}
 charge(n,kind){if(!Number.isFinite(n)||n<0||this.player.terra<n)throw Error("Insufficient $TERRA balance or invalid amount.");this.player.terra-=n;this.treasury.collected+=n*(this.config.feeBps?.[kind]??0)/10000;}
 claim(id){const p=this.parcels.find(x=>x.id===id);if(!p||p.owner)throw Error("Parcel unavailable.");if(this.stats.parcels>=this.config.economy.maxOwnedSoft)throw Error("Ownership limit reached.");this.charge(this.config.economy.claimCost,"claim");p.owner="you";this.player.xp+=10;this.emit("claim",{parcel:p});return p;}
 upgrade(id){const p=this.owned(id);this.charge(this.config.economy.upgradeCost*p.level,"upgrade");p.level++;p.yield=+(p.yield*1.2).toFixed(2);p.health=100;this.emit("upgrade");}
 owned(id){const p=this.parcels.find(x=>x.id===id&&x.owner==="you");if(!p)throw Error("You do not own this parcel.");return p;}
 maintain(id){const p=this.owned(id);this.charge(this.config.economy.maintainBase*p.level,"seal");p.health=100;this.emit("maintain");}
 forge(id){const p=this.owned(id);this.charge(this.config.economy.mintCost,"mint");const a={id:uid(),parcelId:id,name:p.biome+" Genesis #"+(this.assets.length+1),rarity:p.rarity,createdAt:new Date().toISOString(),chainStatus:"simulation",virtualAsset:true};this.assets.push(a);this.emit("forge",{asset:a});return a;}
 listAsset(id,price){const a=this.assets.find(x=>x.id===id&&!x.listed);if(!a||!Number.isFinite(price)||price<=0)throw Error("Asset or price invalid.");a.listed=true;const l={id:uid(),assetId:id,price,seller:"you",status:"active"};this.listings.push(l);this.emit("listing",{listing:l});return l;}
 step(){for(const p of this.parcels.filter(x=>x.owner==="you"))p.health=clamp(p.health-.002,0,100);this.player.energy=clamp(this.player.energy+.15,0,100);this.emit("tick");}
}