import * as Ot from "@pixi/layers";
import { Group as Et, Layer as Dt } from "@pixi/layers";
import { Signal as Wt, Entity as Lt, ServiceContainer as l, Utils as Pt, EntityStorage as Ft, DeferredPromise as R, MyshApp as Rt, UpdateLoop as Q, SignalController as qt } from "myshengine-core";
import { BitmapFontData as zt, BitmapFont as Z, Assets as q, Texture as $t, Spritesheet as Ut, Container as b, Application as U, Graphics as K, Sprite as ot, BitmapText as ct, TextStyle as Gt, Text as ht, NineSlicePlane as lt } from "pixi.js";
import * as Nt from "@pixi/particle-emitter";
import { Spine as ut } from "pixi-spine";
class B {
  constructor() {
    this._groups = /* @__PURE__ */ new Map(), this._layers = /* @__PURE__ */ new Map();
  }
  setStage(t) {
    this._stage = t;
  }
  createGroups(t, e, s) {
    var a;
    const i = new Et(e, s), r = new Dt(i);
    r.name = t, this._groups.set(t, i), this._layers.set(t, r), (a = this._stage) == null || a.addChild(r);
  }
  getGroup(t) {
    return this._groups.get(t);
  }
  setLayer(t, e) {
    const s = this._groups.get(t);
    s && (e.parentGroup = s, this.sort(t));
  }
  setOrder(t, e) {
    t.zOrder = e;
  }
  sort(t) {
    var s, i;
    (s = this._stage) == null || s.sortChildren(), (i = this._stage) == null || i.updateStage();
    const e = this._layers.get(t);
    e && e.sortChildren();
  }
  sortAll() {
    var t, e;
    (t = this._stage) == null || t.sortChildren(), (e = this._stage) == null || e.updateStage(), Array.from(this._layers.values()).forEach((s) => {
      s.sortChildren();
    });
  }
}
class jt {
  constructor(t) {
    this._assetsManager = t;
  }
  build(t, e, s) {
    const i = s[t], r = i.textures;
    for (let a in i.animations) {
      this._assetsManager.add(t);
      const c = i.animations[a];
      this._assetsManager.updateOnLoad(t, [{ name: a, asset: c, bundle: e }]);
    }
    for (let a in r)
      this._assetsManager.updateOnLoad(e, [{ name: a, asset: r[a], bundle: e }]);
  }
}
class Vt {
  constructor(t) {
    this._assetsManager = t;
  }
  build(t, e, s) {
    this._assetsManager.updateOnLoad(e, [{ name: t, asset: s[t], bundle: e }]);
  }
}
class Ht {
  constructor(t) {
    this._assetsManager = t;
  }
  build(t, e, s) {
    const i = new zt(), r = s[t], a = {
      dot: ".",
      comma: ",",
      usd: "$",
      eur: "€",
      space: " ",
      dash: "-",
      plus: "+"
    }, c = r.data.frames, o = Object.keys(c).map((u, _) => {
      i.page.push({
        id: _,
        file: ""
      });
      const A = (u.length > 1 ? a[u] : u).charCodeAt(0), w = r.textures[u];
      return i.char.push({
        id: A,
        page: _,
        x: 0,
        y: 0,
        width: w.width,
        height: w.height,
        xoffset: 0,
        yoffset: 0,
        xadvance: w.width
      }), w;
    });
    i.common[0] = {
      lineHeight: o[0].height
    }, i.info[0] = {
      face: t,
      size: o[0].height
    };
    const g = new Z(i, o, !0);
    Z.available[t] = g;
  }
}
class Xt {
  constructor(t) {
    this._assetsManager = t;
  }
  build(t, e, s) {
    this._assetsManager.updateOnLoad(e, [{ name: t, asset: s[t].spineData, bundle: e }]);
  }
}
class k {
  constructor(t) {
    this._assetsManager = t, this._dimension = "", this._behaviours = /* @__PURE__ */ new Map(), this.closestDimension = (e) => {
      const s = window.screen.height * window.devicePixelRatio, i = window.screen.width * window.devicePixelRatio, r = s > i ? s : i, a = e.map((u) => Math.abs(r - u.width));
      let c = a[0], o = 0;
      return a.map((u, _) => {
        u < c && (c = u, o = _);
      }), e[o].alias;
    };
  }
  get dimension() {
    return this._dimension;
  }
  async init(t) {
    const { bundles: e } = t.manifest, s = await this.checkWebPSupport();
    this._dimension = this.closestDimension(t.resolutions), t.ignoreFormats && this.ignoreFormats(e, t.ignoreFormats), this.selectResolution(e, this._dimension), this.selectWebp(e, s), this.setupBehaviours(), q.setPreferences({
      preferCreateImageBitmap: !1,
      preferWorkers: !1
    }), await q.init({ manifest: { bundles: e } });
  }
  async loadBundle(t) {
    return this._assetsManager.add(t), q.loadBundle(t).then((e) => {
      this.processBundle(t, e);
    });
  }
  processBundle(t, e) {
    for (let s in e) {
      let i;
      e[s].hasOwnProperty("spineData") ? i = this._behaviours.get("spine") : e[s] instanceof $t ? i = this._behaviours.get("texture") : e[s] instanceof Ut ? i = this._behaviours.get("spritesheet") : t === "fonts" && (i = this._behaviours.get("bitmap")), i && i.build(s, t, e);
    }
  }
  setupBehaviours() {
    this._behaviours.set("spritesheet", new jt(this._assetsManager)), this._behaviours.set("texture", new Vt(this._assetsManager)), this._behaviours.set("bitmap", new Ht(this._assetsManager)), this._behaviours.set("spine", new Xt(this._assetsManager));
  }
  checkWebPSupport() {
    return new Promise((t) => {
      const e = new Image();
      e.onload = e.onerror = () => {
        t(e.height === 2);
      }, e.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    });
  }
  selectResolution(t, e) {
    for (let s of t)
      for (let i of s.assets)
        if (Array.isArray(i.srcs)) {
          const r = i.srcs.filter((a) => a.includes(e));
          r && r.length && (i.srcs = r);
        }
  }
  selectWebp(t, e) {
    for (let s of t)
      for (let i of s.assets)
        if (Array.isArray(i.srcs)) {
          const r = e ? i.srcs.find((a) => a.includes("_webp")) : i.srcs.find((a) => !a.includes("_webp"));
          r && (i.srcs = r);
        }
  }
  ignoreFormats(t, e) {
    for (let s of t) {
      for (let i of s.assets) {
        if (!Array.isArray(i.srcs)) continue;
        const r = i.srcs.some(
          (a) => e.some((c) => a.includes(`.${c}`))
        );
        s.assets = s.assets.filter(() => !r);
      }
      if (s.assets.length == 0) {
        const i = t.indexOf(s);
        t.splice(i, 1);
      }
    }
  }
}
class z {
  constructor() {
    this._emitters = /* @__PURE__ */ new Map();
  }
  createParticleEmitter(t, e, s) {
    const i = new Nt.Emitter(e, s);
    return this._emitters.set(t, i), i;
  }
  update(t) {
    Array.from(this._emitters.values()).forEach((s) => {
      s.update(t);
    });
  }
  emit(t) {
    const e = this._emitters.get(t);
    e && (e.emit = !0);
  }
  emitAll() {
    Array.from(this._emitters.values()).forEach((e) => {
      e.emit = !0;
    });
  }
}
const Yt = new Wt();
var L = /* @__PURE__ */ ((n) => (n.Pending = "Pending", n.Loaded = "Loaded", n))(L || {});
class Jt extends Lt {
  get active() {
    return this.getComponent(b).visible;
  }
  set active(t) {
    const e = this.getComponent(b);
    e.visible = t;
  }
}
class G {
  constructor() {
    this._list = /* @__PURE__ */ new Map();
  }
  add(t, e) {
    this._list.set(t, e);
  }
  get(t) {
    return this._list.get(t) || null;
  }
  getInChildren(t) {
    const e = [];
    for (let s = 0; s < t.children.length; s++) {
      const i = t.children[s], r = this.get(i);
      r && e.push(r);
      const a = this.getInChildren(i);
      e.push(...a);
    }
    return e;
  }
  getInChildrenByFilter(t, e) {
    const s = [];
    return this.getInChildren(t).forEach((r) => {
      r.isSatisfiedFilter(e) && s.push(r);
    }), s;
  }
  getComponent(t, e) {
    const s = this.get(t);
    if (!s) throw new Error(`Entity not found for view: ${t.name}`);
    return s.getComponent(e);
  }
}
class S {
  setCommonData(t, e) {
    if (e.name = t.name, e.alpha = t.alpha === void 0 ? 1 : t.alpha, e.rotation = t.rotation || 0, e.zIndex = t.zIndex || 0, e.zOrder = t.zOrder || 0, e.visible = t.visible !== void 0 ? t.visible : !0, e.sortableChildren = !!t.sortableChildren, t.position && (e.position = { x: t.position.x || 0, y: t.position.y || 0 }), t.relativePosition && this.setRelativePosition(t.relativePosition, e), t.scale && (e.scale = { x: t.scale.x || 1, y: t.scale.y || 1 }), t.pivot && (e.pivot = { x: t.pivot.x || 0, y: t.pivot.y || 0 }), t.width && (e.width = t.width), t.height && (e.height = t.height), t.hitArea && (e.hitArea = t.hitArea), t.parentGroup) {
      const s = l.instance.get(B);
      e.parentGroup = s.getGroup(t.parentGroup);
    }
    if (t.entity && this.setEntity(t.entity, e), t.mask && this.setMask(t.mask, e), t.interactive && (e.eventMode = t.interactive.eventMode, e.cursor = t.interactive.cursor, t.interactive.events.forEach(({ evnetType: s, callback: i }) => {
      e.on(s, i);
    })), t.interactiveChildren !== void 0 && (e.interactiveChildren = t.interactiveChildren), t.debugBorder) {
      const s = t.debugBorderColor || 16711680, i = t.debugBorderWidth || 1;
      this.setDebugBorder(e, i, s);
    }
  }
  setAnchor(t, e) {
    const i = t || { x: 0.5, y: 0.5 }, r = i.x === void 0 ? 0.5 : i.x, a = i.y === void 0 ? 0.5 : i.y;
    e.anchor.set(r, a);
  }
  setRelativePosition(t, e) {
    const s = l.instance.get(U), { width: i, height: r } = s.renderer.screen, a = t.x || 0, c = t.y || 0, o = i / 2 * a, g = r / 2 * c;
    e.position.set(o, g);
  }
  setMask(t, e) {
    const { x: s, y: i, type: r } = t, a = new K();
    if (a.beginFill(t.color || 16777215), r === "rect") {
      let { width: c, height: o } = t;
      c || (c = s), o || (o = i), a.drawRect(s, i, s + c, i + o), a.pivot.x = c / 2, a.pivot.y = o / 2;
    } else r === "circle" && (a.drawCircle(s, i, t.radius || 1), a.x = e.width / 2, a.y = e.height / 2);
    a.endFill(), t.isDebug || (e.mask = a), e.addChild(a);
  }
  setEntity(t, e) {
    const s = t.instance ? t.instance(e) : new Jt(Pt.uuid(), `Entity-${e.name}`), i = t.components || [];
    this.setComponents(s, [e, ...i]);
    const r = l.instance.get(Ft), a = l.instance.get(G);
    r.addEntity(s), a.add(e, s), e.on("destroyed", () => {
      r.removeEntity(s.uuid);
    });
  }
  setComponents(t, e) {
    e.forEach((s) => t.addComponent(s));
  }
  setDebugBorder(t, e, s) {
    const i = new K();
    i.lineStyle(e, s, e).drawRect(-e, -e, t.width + e, t.height + e), i.pivot.x = t.width / 2, i.pivot.y = t.height / 2, t.addChild(i);
  }
}
class Qt extends S {
  create(t) {
    const e = new b();
    return this.setCommonData(t, e), e;
  }
}
class Zt {
  constructor(t) {
    this._name = t, this.data = [], this.status = L.Pending, this._loaded = new Promise((e) => this._resolve = e);
  }
  get name() {
    return this._name;
  }
  get loaded() {
    return this._loaded;
  }
  get resolve() {
    return this._resolve;
  }
  getAssetByName(t) {
    const e = typeof t == "string" ? t : t.name;
    return this.data.find((s) => s.name === e);
  }
}
class x {
  constructor() {
    this.list = /* @__PURE__ */ new Map();
  }
  add(t) {
    const e = new Zt(t);
    this.list.set(t, e);
  }
  updateOnLoad(t, e) {
    const s = this.list.get(t);
    s && (s.data.push(...e), s.status = L.Loaded, s.resolve(s));
  }
  getBundle(t) {
    let e;
    return typeof t == "string" ? e = this.findParentBundle(t) : e = this.list.get(t.bundle), e;
  }
  getAsset(t) {
    const e = this.getBundle(t);
    if (e)
      return e == null ? void 0 : e.getAssetByName(t);
  }
  hasAsset(t) {
    const e = this.getBundle(t);
    return !!(e != null && e.getAssetByName(t));
  }
  findParentBundle(t) {
    const i = Array.from(this.list.values()).flatMap((r) => r.data).find((r) => r.name === t);
    if (i)
      return this.list.get(i.bundle);
  }
}
class Kt extends S {
  create(t) {
    const s = l.instance.get(x).getAsset(t.asset);
    if (!s) throw new Error(`Asset ${t.asset.toString()} not found!`);
    const i = s.asset, r = new ot();
    return r.texture = i, r.tint = t.tint ? t.tint : 16777215, this.setCommonData(t, r), this.setAnchor(t.anchor, r), r;
  }
}
class kt extends S {
  create(t) {
    const e = new ct(t.text, t.bitmapTextStyle);
    return this.setCommonData(t, e), this.setAnchor(t.anchor, e), e.tint = t.tint ? t.tint : 16777215, e;
  }
}
class te extends S {
  create(t) {
    const e = new Gt(t.textStyle || {}), s = new ht(t.text, e);
    return this.setCommonData(t, s), this.setAnchor(t.anchor, s), s;
  }
}
class ee {
  constructor(t, e) {
    this._name = t, this._spineController = e, this._timescaleModifier = 0, this._timeScaleMiltiplier = 1, this._chain = [], this._curent = null, this._listener = null, this._originalTimeScale = 0;
  }
  get current() {
    return this._curent;
  }
  get promises() {
    return this._chain.map(({ deferredPromise: t }) => t);
  }
  add(t, e, s = { loopCount: 1, timeScale: 1 }) {
    const i = [];
    if (s.loopCount === void 0 && (s.loopCount = 1), s.timeScale === void 0 && (s.timeScale = 1), s.loopCount !== -1)
      for (let r = 0; r < s.loopCount; r++) {
        const a = new R();
        i.push({ spine: t, name: e, options: s, deferredPromise: a });
      }
    else {
      const r = new R();
      i.push({ spine: t, name: e, options: s, deferredPromise: r }), console.warn("[SpineChainsUtil]: loopCount -1 looped your animation forever!");
    }
    return this._chain.push(...i), this;
  }
  async play() {
    for (; this._chain.length > 0; ) {
      const t = this._curent = this._chain[0], { spine: e, name: s, deferredPromise: i, options: r } = t, { loopCount: a, timeScale: c } = r;
      a === -1 && this.add(e, s, r), e.state.timeScale = c || 0, this._originalTimeScale = e.state.timeScale, c && (e.state.timeScale = (c + this._timescaleModifier) * this._timeScaleMiltiplier), this._listener && e.state.removeListener(this._listener), this.clear(e), this._listener = this.setListener(r, i), e.state.addListener(this._listener), e.state.setAnimation(0, s, !1), await i.promise, this._chain.shift();
    }
    this._spineController.remove(this._name);
  }
  stop(t = !1) {
    t && this._chain.forEach((s) => this.clear(s.spine));
    const e = this.promises;
    R.resolveAll(e, void 0), this._chain.length = 0, this._spineController.remove(this._name);
  }
  multiplyTimeScale(t) {
    this._curent && (t <= 0 && (t = 1), this._timeScaleMiltiplier = t, this._curent.spine.state.timeScale = (this._originalTimeScale + this._timescaleModifier) * t);
  }
  increaseTimeScale(t) {
    this._curent && (this._timescaleModifier = t, this._curent.spine.state.timeScale += t);
  }
  decreaseTimeScale(t) {
    this._curent && (this._timescaleModifier = 0, this._curent.spine.state.timeScale -= t);
  }
  pause() {
    this._curent && (this._originalTimeScale = this._curent.spine.state.timeScale, this._curent.spine.state.timeScale = 0);
  }
  resume() {
    this._curent && (this._curent.spine.state.timeScale = this._originalTimeScale + this._timescaleModifier);
  }
  setListener(t, e) {
    return {
      start: (s) => {
        t.start && t.start(s);
      },
      interrupt: (s) => {
        t.interrupt && t.interrupt(s);
      },
      end: (s) => {
        t.end && t.end(s);
      },
      dispose: (s) => {
        t.dispose && t.dispose(s);
      },
      complete: (s) => {
        t.complete && t.complete(s), e.resolve(!0);
      },
      event: (s, i) => {
        t.event && t.event(s, i);
      }
    };
  }
  clear(t) {
    t.state.clearTracks(), t.state.tracks = [], t.skeleton.setToSetupPose(), this._listener && t.state.removeListener(this._listener), t.lastTime = null;
  }
}
class N {
  constructor() {
    this._chains = /* @__PURE__ */ new Map();
  }
  get _spineChains() {
    return Array.from(this._chains.values());
  }
  create(t) {
    const e = new ee(t, this);
    return this._chains.set(t, e), e;
  }
  get(t) {
    return this._chains.get(t);
  }
  remove(t) {
    this._chains.has(t) && this._chains.delete(t);
  }
  removeAll() {
    for (const [t] of this._chains.entries())
      this.remove(t);
  }
  multyplyTimeScaleAll(t) {
    this._spineChains.forEach((e) => e.multiplyTimeScale(t));
  }
  multyplyTimeScale(t, e) {
    const s = this.get(t);
    s == null || s.multiplyTimeScale(e);
  }
  increaseTimeScaleAll(t) {
    this._spineChains.forEach((e) => e.increaseTimeScale(t));
  }
  increaseTimeScale(t, e) {
    const s = this.get(t);
    s == null || s.increaseTimeScale(e);
  }
  decreaseTimeScaleAll(t) {
    this._spineChains.forEach((e) => e.decreaseTimeScale(t));
  }
  decreaseTimeScale(t, e) {
    const s = this.get(t);
    s == null || s.decreaseTimeScale(e);
  }
  pauseAll() {
    this._spineChains.forEach((t) => t.pause());
  }
  pause(t) {
    const e = this.get(t);
    e == null || e.pause();
  }
  resumeAll() {
    this._spineChains.forEach((t) => t.resume());
  }
  resume(t) {
    const e = this.get(t);
    e == null || e.resume();
  }
  stopAll(t = !1) {
    this._spineChains.forEach((e) => e.stop(t));
  }
  stop(t, e = !1) {
    const s = this.get(t);
    s == null || s.stop(e);
  }
}
class tt {
  getDuration(t, e) {
    const s = t.spineData.findAnimation(e);
    if (s === null) throw Error(`[SpineChainsUtil]: Animation ${e} not found`);
    return s.duration;
  }
  findSlotIndex(t, e) {
    return t.skeleton.findSlotIndex(e);
  }
  findSlotByName(t, e) {
    const s = this.findSlotIndex(t, e);
    return t.slotContainers[s].children[0];
  }
  setSlotAlpha(t, e, s) {
    const i = t.skeleton.findSlot(e);
    i.currentSprite.alpha = s;
  }
  addToSlot(t, e, s) {
    this.findSlotByName(t, e).addChild(s);
  }
  setSkin(t, e) {
    const s = t.skeleton.data.findSkin(e);
    if (!s) throw Error(`[SpineChainsUtil]: Skin ${e} not found`);
    t.skeleton.skin = s, t.skeleton.setSlotsToSetupPose(), t.state.apply(t.skeleton);
  }
}
class se extends S {
  create(t) {
    const e = l.instance.get(x), s = l.instance.get(N), i = e.getAsset(t.asset);
    if (!i) throw new Error(`Asset ${t.asset.toString()} not found!`);
    const r = i.asset, a = new ut(r);
    if (t.initialAnimation && a.state.hasAnimation(t.initialAnimation)) {
      const c = `${t.key || ""}:${t.name}`;
      s.create(c).add(a, t.initialAnimation, {
        timeScale: t.timeScale,
        loopCount: t.loop
      }).play(), a.autoUpdate = !0;
    }
    return t.skin && a.skeleton.data.findSkin(t.skin) && (a.skeleton.setSkinByName(t.skin), a.skeleton.setSlotsToSetupPose()), this.setCommonData(t, a), a;
  }
}
class ie extends S {
  create(t) {
    const s = l.instance.get(x).getAsset(t.asset);
    if (!s) throw new Error(`Asset ${t.asset.toString()} not found!`);
    const i = s.asset, r = new lt(
      i,
      t.leftWidth,
      t.topHeight,
      t.rightWidth,
      t.bottomHeight
    );
    return r.tint = t.tint ? t.tint : 16777215, this.setCommonData(t, r), r;
  }
}
class j {
  constructor(t) {
    this._assetsManager = t, this._behaviours = /* @__PURE__ */ new Map(), this.setupBehaviours();
  }
  create(t, e) {
    const s = this._behaviours.get(t.type);
    if (!s) throw new Error(`Unsupported type: ${t.type}`);
    if (e ? this.loadLazyAsset(t, e) : !1) return;
    const r = s.create(t);
    return e == null || e.addChild(r), Yt.dispatch(r), t.children && this.createChildren(t.children, r), r;
  }
  setupBehaviours() {
    this._behaviours.set(b, new Qt()), this._behaviours.set(ot, new Kt()), this._behaviours.set(ct, new kt()), this._behaviours.set(ht, new te()), this._behaviours.set(ut, new se()), this._behaviours.set(lt, new ie());
  }
  createChildren(t, e) {
    for (let s = 0; s < t.length; s++) {
      const i = t[s];
      this.create(i, e);
    }
  }
  loadLazyAsset(t, e) {
    let s = !1;
    if ("asset" in t) {
      const i = this._assetsManager.getBundle(t.asset);
      if (!i) throw new Error("No such asset");
      i.status === L.Pending && (i.loaded.then(() => {
        this.create(t, e);
      }), s = !0);
    }
    return s;
  }
}
class ne {
  constructor(t, e, s) {
    this._factory = t, this._size = e, this._dynamic = s, this._pool = [], this.intitialize();
  }
  get size() {
    return this._size;
  }
  get currentSize() {
    return this._pool.length;
  }
  intitialize() {
    for (let t = 0; t < this._size; ++t) {
      const e = this._factory.create();
      this._pool.push(e);
    }
  }
  get() {
    if (!this._pool.length && !this._dynamic)
      throw new Error("No more items in pool");
    let t;
    return this._pool.length && (t = this._pool.pop()), !t && this._dynamic && (t = this._factory.create()), t;
  }
  release(t) {
    this._factory.reset(t), this._pool.push(t);
  }
}
class Re {
  createFromConfig(t) {
    return this.config = t, l.instance.get(j).create(t);
  }
}
class et {
  constructor() {
    this._pools = /* @__PURE__ */ new Map();
  }
  create(t, e, s, i) {
    const r = new e(), a = new ne(r, s, i);
    return this._pools.set(t, a), a;
  }
  get(t) {
    let e = this._pools.get(t);
    if (!e) throw Error(`No pool with name ${t} found`);
    return e;
  }
}
class m {
  constructor() {
    this.tag = -1, this.originalTarget = null, this.target = null;
  }
  clone() {
    const t = new m();
    return t.originalTarget = null, t.target = null, t;
  }
  isDone() {
    return !0;
  }
  startWithTarget(t) {
    this.originalTarget = t, this.target = t;
  }
  stop() {
    this.target = null;
  }
  step(t) {
  }
  update(t) {
  }
  getTarget() {
    return this.target;
  }
  setTarget(t) {
    this.target = t;
  }
  getOriginalTarget() {
    return this.originalTarget;
  }
  setOriginalTarget(t) {
    this.originalTarget = t;
  }
  reverse() {
    return null;
  }
  retain() {
  }
  release() {
  }
}
class P extends m {
  constructor() {
    super(...arguments), this._duration = 0, this._timesForRepeat = 1;
  }
  getDuration() {
    return this._duration * (this._timesForRepeat || 1);
  }
  setDuration(t) {
    this._duration = t;
  }
  clone() {
    return new P();
  }
}
class I extends P {
  isDone() {
    return !0;
  }
  step(t) {
    this.update(1);
  }
  update(t) {
  }
  reverse() {
    return this.clone();
  }
  clone() {
    return new I();
  }
}
const re = 1192092896e-16;
class h extends P {
  constructor(t) {
    super(), this.MAX_VALUE = 2, this._elapsed = 0, this._firstTick = !1, this._easeList = [], this._speed = 1, this._repeatForever = !1, this._repeatMethod = !1, this._speedMethod = !1, t !== void 0 && !Number.isNaN(t) && this.initWithDuration(t);
  }
  getElapsed() {
    return this._elapsed;
  }
  initWithDuration(t) {
    return this._duration = t === 0 ? re : t, this._elapsed = 0, this._firstTick = !0, !0;
  }
  isDone() {
    return this._elapsed >= this._duration;
  }
  clone() {
    const t = new h(this._duration);
    return this.cloneDecoration(t), t;
  }
  easing(t) {
    this._easeList ? this._easeList.length = 0 : this._easeList = [];
    for (let e = 0; e < arguments.length; e++) this._easeList.push(arguments[e]);
    return this;
  }
  step(t) {
    this._firstTick ? (this._firstTick = !1, this._elapsed = 0) : this._elapsed += t;
    let e = this._elapsed / (this._duration > 1192092896e-16 ? this._duration : 1192092896e-16);
    e = e < 1 ? e : 1, this.update(e > 0 ? e : 0), this._repeatMethod && this._timesForRepeat > 1 && this.isDone() && (this._repeatForever || this._timesForRepeat--, this.startWithTarget(this.target), this.step(this._elapsed - this._duration));
  }
  startWithTarget(t) {
    m.prototype.startWithTarget.call(this, t), this._elapsed = 0, this._firstTick = !0;
  }
  reverse() {
    return this;
  }
  setAmplitudeRate(t) {
  }
  getAmplitudeRate() {
    return 0;
  }
  speed(t) {
    return t <= 0 ? this : (this._speedMethod = !0, this._speed *= t, this);
  }
  getSpeed() {
    return this._speed;
  }
  setSpeed(t) {
    return this._speed = t, this;
  }
  repeat(t) {
    return t = Math.round(t), Number.isNaN(t) || t < 1 ? this : (this._repeatMethod = !0, this._timesForRepeat *= t, this);
  }
  repeatForever() {
    return this._repeatMethod = !0, this._timesForRepeat = this.MAX_VALUE, this._repeatForever = !0, this;
  }
  cloneDecoration(t) {
    t._repeatForever = this._repeatForever, t._speed = this._speed, t._timesForRepeat = this._timesForRepeat, t._easeList = this._easeList, t._speedMethod = this._speedMethod, t._repeatMethod = this._repeatMethod;
  }
  reverseEaseList(t) {
    if (this._easeList) {
      t._easeList = [];
      for (let e = 0; e < this._easeList.length; e++)
        t._easeList.push(this._easeList[e]);
    }
  }
  computeEaseTime(t) {
    return t;
  }
}
class H extends I {
  constructor(t, e, s) {
    super(), this._selectorTarget = null, this._function = null, this._data = null, this.initWithFunction(t, e, s);
  }
  initWithFunction(t, e, s) {
    return t && (this._function = t), e && (this._selectorTarget = e), s !== void 0 && (this._data = s), !0;
  }
  execute() {
    this._function && this._function.call(this._selectorTarget, this.target, this._data);
  }
  update(t) {
    this.execute();
  }
  getTargetCallback() {
    return this._selectorTarget;
  }
  setTargetCallback(t) {
    t !== this._selectorTarget && (this._selectorTarget && (this._selectorTarget = null), this._selectorTarget = t);
  }
  clone() {
    const t = new H();
    return t.initWithFunction(this._function, this._selectorTarget, this._data), t;
  }
}
const v = class v extends h {
  constructor(t) {
    super(), this._actions = [], this._split = 0, this._last = 0, this._reversed = !1;
    const e = t instanceof Array ? t : arguments;
    if (e.length === 1)
      return;
    const s = e.length - 1;
    if (s >= 0) {
      let i = e[0], r;
      for (let a = 1; a < s; a++)
        e[a] && (r = i, i = v._actionOneTwo(r, e[a]));
      this.initWithTwoActions(i, e[s]);
    }
  }
  initWithTwoActions(t, e) {
    if (!t || !e)
      return !1;
    let s = t._duration, i = e._duration;
    s *= t._repeatMethod ? t._timesForRepeat : 1, i *= e._repeatMethod ? e._timesForRepeat : 1;
    const r = s + i;
    return this.initWithDuration(r), this._actions[0] = t, this._actions[1] = e, !0;
  }
  clone() {
    const t = new v();
    return this.cloneDecoration(t), t.initWithTwoActions(this._actions[0].clone(), this._actions[1].clone()), t;
  }
  startWithTarget(t) {
    h.prototype.startWithTarget.call(this, t), this._split = this._actions[0]._duration / this._duration, this._split *= this._actions[0]._repeatMethod ? this._actions[0]._timesForRepeat : 1, this._last = -1;
  }
  stop() {
    this._last !== -1 && this._actions[this._last].stop(), m.prototype.stop.call(this);
  }
  update(t) {
    let e, s = 0;
    const i = this._split, r = this._actions, a = this._last;
    let c;
    t = this.computeEaseTime(t), t < i ? (e = i !== 0 ? t / i : 1, s === 0 && a === 1 && this._reversed && (r[1].update(0), r[1].stop())) : (s = 1, e = i === 1 ? 1 : (t - i) / (1 - i), a === -1 && (r[0].startWithTarget(this.target), r[0].update(1), r[0].stop()), a === 0 && (r[0].update(1), r[0].stop())), c = r[s], !(a === s && c.isDone()) && (a !== s && c.startWithTarget(this.target), e *= c._timesForRepeat, c.update(e > 1 ? e % 1 : e), this._last = s);
  }
  reverse() {
    const t = v._actionOneTwo(this._actions[1].reverse(), this._actions[0].reverse());
    return this.cloneDecoration(t), this.reverseEaseList(t), t._reversed = !0, t;
  }
};
v._actionOneTwo = function(t, e) {
  const s = new v();
  return s.initWithTwoActions(t, e), s;
};
let C = v;
function $(n) {
  const t = n instanceof Array ? n : arguments;
  if (t.length === 1)
    return t[0];
  const e = t.length - 1;
  let s = null;
  if (e >= 0) {
    s = t[0];
    for (let i = 1; i <= e; i++)
      t[i] && (s = C._actionOneTwo(s, t[i]));
  }
  return s;
}
class O extends h {
  constructor(t, e) {
    super(), this._times = 0, this._total = 0, this._nextDt = 0, this._actionInstant = !1, this._innerAction = null, e !== void 0 && this.initWithAction(t, e);
  }
  initWithAction(t, e) {
    const s = t._duration * e;
    return this.initWithDuration(s) ? (this._times = e, this._innerAction = t, t instanceof I && (this._actionInstant = !0, this._times -= 1), this._total = 0, !0) : !1;
  }
  clone() {
    const t = new O();
    return this.cloneDecoration(t), t.initWithAction(this._innerAction.clone(), this._times), t;
  }
  startWithTarget(t) {
    this._total = 0, this._nextDt = this._innerAction._duration / this._duration, h.prototype.startWithTarget.call(this, t), this._innerAction.startWithTarget(t);
  }
  stop() {
    this._innerAction.stop(), m.prototype.stop.call(this);
  }
  update(t) {
    t = this.computeEaseTime(t);
    const e = this._innerAction, s = this._duration, i = this._times;
    let r = this._nextDt;
    if (t >= r) {
      for (; t > r && this._total < i; )
        e.update(1), this._total++, e.stop(), e.startWithTarget(this.target), r += e._duration / s, this._nextDt = r > 1 ? 1 : r;
      t >= 1 && this._total < i && (e.update(1), this._total++), this._actionInstant || (this._total === i ? e.stop() : e.update(t - (r - e._duration / s)));
    } else
      e.update(t * i % 1);
  }
  isDone() {
    return this._total === this._times;
  }
  reverse() {
    const t = new O(this._innerAction.reverse(), this._times);
    return this.cloneDecoration(t), this.reverseEaseList(t), t;
  }
  setInnerAction(t) {
    this._innerAction !== t && (this._innerAction = t);
  }
  getInnerAction() {
    return this._innerAction;
  }
}
class E extends h {
  constructor(t) {
    super(), this._innerAction = null, t && this.initWithAction(t);
  }
  initWithAction(t) {
    return t ? (this._innerAction = t, !0) : !1;
  }
  clone() {
    const t = new E();
    return this.cloneDecoration(t), t.initWithAction(this._innerAction.clone()), t;
  }
  startWithTarget(t) {
    h.prototype.startWithTarget.call(this, t), this._innerAction.startWithTarget(t);
  }
  step(t) {
    const e = this._innerAction;
    e.step(t), e.isDone() && (e.startWithTarget(this.target), e.step(e.getElapsed() - e._duration));
  }
  isDone() {
    return !1;
  }
  reverse() {
    const t = new E(this._innerAction.reverse());
    return this.cloneDecoration(t), this.reverseEaseList(t), t;
  }
  setInnerAction(t) {
    this._innerAction !== t && (this._innerAction = t);
  }
  getInnerAction() {
    return this._innerAction;
  }
}
class T extends h {
  update(t) {
  }
  reverse() {
    const t = new T(this._duration);
    return this.cloneDecoration(t), this.reverseEaseList(t), t;
  }
  clone() {
    const t = new T();
    return this.cloneDecoration(t), t.initWithDuration(this._duration), t;
  }
}
const y = class y extends h {
  constructor(t) {
    super(), this._one = null, this._two = null;
    const e = t instanceof Array ? t : arguments;
    if (e.length === 1)
      return;
    const s = e.length - 1;
    if (s >= 0) {
      let i = e[0], r;
      for (let a = 1; a < s; a++)
        e[a] && (r = i, i = y._actionOneTwo(r, e[a]));
      this.initWithTwoActions(i, e[s]);
    }
  }
  initWithTwoActions(t, e) {
    if (!t || !e)
      return !1;
    let s = !1;
    const i = t._duration, r = e._duration;
    return this.initWithDuration(Math.max(i, r)) && (this._one = t, this._two = e, i > r ? this._two = C._actionOneTwo(e, new T(i - r)) : i < r && (this._one = C._actionOneTwo(t, new T(r - i))), s = !0), s;
  }
  clone() {
    const t = new y();
    return this.cloneDecoration(t), t.initWithTwoActions(this._one.clone(), this._two.clone()), t;
  }
  startWithTarget(t) {
    h.prototype.startWithTarget.call(this, t), this._one.startWithTarget(t), this._two.startWithTarget(t);
  }
  stop() {
    this._one.stop(), this._two.stop(), m.prototype.stop.call(this);
  }
  update(t) {
    t = this.computeEaseTime(t), this._one && this._one.update(t), this._two && this._two.update(t);
  }
  reverse() {
    const t = y._actionOneTwo(this._one.reverse(), this._two.reverse());
    return this.cloneDecoration(t), this.reverseEaseList(t), t;
  }
};
y._actionOneTwo = function(t, e) {
  const s = new y();
  return s.initWithTwoActions(t, e), s;
};
let V = y;
function st(n) {
  const t = n instanceof Array ? n : arguments;
  if (t.length === 1)
    return null;
  let e = t[0];
  for (let s = 1; s < t.length; s++)
    t[s] != null && (e = V._actionOneTwo(e, t[s]));
  return e;
}
class X extends h {
  constructor(t) {
    super(), this._other = null, t && this.initWithAction(t);
  }
  initWithAction(t) {
    return !t || t === this._other ? !1 : h.prototype.initWithDuration.call(this, t._duration) ? (this._other = t, !0) : !1;
  }
  clone() {
    const t = new X();
    return this.cloneDecoration(t), t.initWithAction(this._other.clone()), t;
  }
  startWithTarget(t) {
    h.prototype.startWithTarget.call(this, t), this._other.startWithTarget(t);
  }
  update(t) {
    t = this.computeEaseTime(t), this._other && this._other.update(1 - t);
  }
  reverse() {
    return this._other.clone();
  }
  stop() {
    this._other.stop(), m.prototype.stop.call(this);
  }
}
class ae {
  constructor() {
    this.actions = [], this.target = null, this.actionIndex = 0, this.currentAction = null, this.paused = !1, this.lock = !1;
  }
}
class oe {
  constructor() {
    this._hashTargets = /* @__PURE__ */ new Map(), this._arrayTargets = [], this._elementPool = [];
  }
  addAction(t, e, s) {
    if (!t || !e)
      return;
    let i = this._hashTargets.get(e);
    i ? i.actions || (i.actions = []) : (i = this._getElement(e, s), this._hashTargets.set(e, i), this._arrayTargets.push(i)), i.target = e, i.actions.push(t), t.startWithTarget(e);
  }
  removeAllActions() {
    const t = this._arrayTargets;
    for (let e = 0; e < t.length; e++) {
      const s = t[e];
      s && this._putElement(s);
    }
    this._arrayTargets.length = 0, this._hashTargets = /* @__PURE__ */ new Map();
  }
  removeAllActionsFromTarget(t) {
    if (t == null) return;
    const e = this._hashTargets.get(t);
    e && (e.actions.length = 0, this._deleteHashElement(e));
  }
  removeAction(t) {
    if (t == null) return;
    const e = t.getOriginalTarget(), s = this._hashTargets.get(e);
    if (s) {
      for (let i = 0; i < s.actions.length; i++)
        if (s.actions[i] === t) {
          s.actions.splice(i, 1), s.actionIndex >= i && s.actionIndex--;
          break;
        }
    }
  }
  _removeActionByTag(t, e, s) {
    for (let i = 0, r = e.actions.length; i < r; ++i) {
      const a = e.actions[i];
      if (a && a.tag === t) {
        if (s && a.getOriginalTarget() !== s)
          continue;
        this._removeActionAtIndex(i, e);
        break;
      }
    }
  }
  _removeAllActionsByTag(t, e, s) {
    for (let i = e.actions.length - 1; i >= 0; --i) {
      const r = e.actions[i];
      if (r && r.tag === t) {
        if (s && r.getOriginalTarget() !== s)
          continue;
        this._removeActionAtIndex(i, e);
      }
    }
  }
  removeActionByTag(t, e) {
    const s = this._hashTargets;
    if (e) {
      const i = s.get(e);
      i && this._removeActionByTag(t, i, e);
    } else
      s.forEach((i) => {
        this._removeActionByTag(t, i);
      });
  }
  removeAllActionsByTag(t, e) {
    const s = this._hashTargets;
    if (e) {
      const i = s.get(e);
      i && this._removeAllActionsByTag(t, i, e);
    } else
      s.forEach((i) => {
        this._removeAllActionsByTag(t, i);
      });
  }
  getActionByTag(t, e) {
    const s = this._hashTargets.get(e);
    if (s && s.actions != null)
      for (let i = 0; i < s.actions.length; ++i) {
        const r = s.actions[i];
        if (r && r.tag === t)
          return r;
      }
    return null;
  }
  getNumberOfRunningActionsInTarget(t) {
    const e = this._hashTargets.get(t);
    return e && e.actions ? e.actions.length : 0;
  }
  pauseTarget(t) {
    const e = this._hashTargets.get(t);
    e && (e.paused = !0);
  }
  resumeTarget(t) {
    const e = this._hashTargets.get(t);
    e && (e.paused = !1);
  }
  pauseAllRunningActions() {
    const t = [], e = this._arrayTargets;
    for (let s = 0; s < e.length; s++) {
      const i = e[s];
      i && !i.paused && (i.paused = !0, t.push(i.target));
    }
    return t;
  }
  resumeTargets(t) {
    if (t)
      for (let e = 0; e < t.length; e++)
        t[e] && this.resumeTarget(t[e]);
  }
  pauseTargets(t) {
    if (t)
      for (let e = 0; e < t.length; e++)
        t[e] && this.pauseTarget(t[e]);
  }
  _removeActionAtIndex(t, e) {
    e.actions[t], e.actions.splice(t, 1), e.actionIndex >= t && e.actionIndex--, e.actions.length === 0 && this._deleteHashElement(e);
  }
  update(t) {
    const e = this._arrayTargets;
    let s;
    for (let i = 0; i < e.length; i++) {
      if (this._currentTarget = e[i], s = this._currentTarget, !s.paused && s.actions) {
        for (s.lock = !0, s.actionIndex = 0; s.actionIndex < s.actions.length; s.actionIndex++)
          if (s.currentAction = s.actions[s.actionIndex], !!s.currentAction) {
            if (s.currentAction.step(
              t * (this._isActionInternal(s.currentAction) ? s.currentAction.getSpeed() : 1)
            ), s.currentAction && s.currentAction.isDone()) {
              s.currentAction.stop();
              const r = s.currentAction;
              s.currentAction = null, this.removeAction(r);
            }
            s.currentAction = null;
          }
        s.lock = !1;
      }
      s.actions.length === 0 && this._deleteHashElement(s) && i--;
    }
  }
  _getElement(t, e) {
    let s = this._elementPool.pop();
    return s || (s = new ae()), s.target = t, s.paused = !!e, s;
  }
  _putElement(t) {
    t.actions.length = 0, t.actionIndex = 0, t.currentAction = null, t.paused = !1, t.target = null, t.lock = !1, this._elementPool.push(t);
  }
  _deleteHashElement(t) {
    let e = !1;
    if (t && !t.lock && this._hashTargets.get(t.target)) {
      this._hashTargets.delete(t.target);
      const s = this._arrayTargets;
      for (let i = 0, r = s.length; i < r; i++)
        if (s[i] === t) {
          s.splice(i, 1);
          break;
        }
      this._putElement(t), e = !0;
    }
    return e;
  }
  _isActionInternal(t) {
    return typeof t._speedMethod < "u";
  }
}
const W = class W {
  constructor() {
    this.actionMgr = new oe();
  }
  static get instance() {
    return this._instance || (this._instance = new W()), this._instance;
  }
  get ActionManager() {
    return this.actionMgr;
  }
  update(t) {
    this.actionMgr.update(t);
  }
};
W._instance = null;
let f = W;
const ce = () => 0, he = (n) => n, dt = (n) => n * n, _t = (n) => n * (2 - n), le = (n) => (n *= 2, n < 1 ? 0.5 * n * n : -0.5 * (--n * (n - 2) - 1)), pt = (n) => n * n * n, gt = (n) => --n * n * n + 1, ue = (n) => (n *= 2, n < 1 ? 0.5 * n * n * n : 0.5 * ((n -= 2) * n * n + 2)), ft = (n) => n * n * n * n, mt = (n) => 1 - --n * n * n * n, de = (n) => (n *= 2, n < 1 ? 0.5 * n * n * n * n : -0.5 * ((n -= 2) * n * n * n - 2)), At = (n) => n * n * n * n * n, vt = (n) => --n * n * n * n * n + 1, _e = (n) => (n *= 2, n < 1 ? 0.5 * n * n * n * n * n : 0.5 * ((n -= 2) * n * n * n * n + 2)), yt = (n) => n === 1 ? 1 : 1 - Math.cos(n * Math.PI / 2), wt = (n) => Math.sin(n * Math.PI / 2), pe = (n) => 0.5 * (1 - Math.cos(Math.PI * n)), Tt = (n) => n === 0 ? 0 : Math.pow(1024, n - 1), St = (n) => n === 1 ? 1 : 1 - Math.pow(2, -10 * n), ge = (n) => n === 0 ? 0 : n === 1 ? 1 : (n *= 2, n < 1 ? 0.5 * Math.pow(1024, n - 1) : 0.5 * (-Math.pow(2, -10 * (n - 1)) + 2)), Mt = (n) => 1 - Math.sqrt(1 - n * n), bt = (n) => Math.sqrt(1 - --n * n), fe = (n) => (n *= 2, n < 1 ? -0.5 * (Math.sqrt(1 - n * n) - 1) : 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1)), xt = (n) => {
  let t, e = 0.1;
  const s = 0.4;
  return n === 0 ? 0 : n === 1 ? 1 : (!e || e < 1 ? (e = 1, t = s / 4) : t = s * Math.asin(1 / e) / (2 * Math.PI), -(e * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - t) * (2 * Math.PI) / s)));
}, Ct = (n) => {
  let t, e = 0.1;
  const s = 0.4;
  return n === 0 ? 0 : n === 1 ? 1 : (!e || e < 1 ? (e = 1, t = s / 4) : t = s * Math.asin(1 / e) / (2 * Math.PI), e * Math.pow(2, -10 * n) * Math.sin((n - t) * (2 * Math.PI) / s) + 1);
}, me = (n) => {
  let t, e = 0.1;
  const s = 0.4;
  return n === 0 ? 0 : n === 1 ? 1 : (!e || e < 1 ? (e = 1, t = s / 4) : t = s * Math.asin(1 / e) / (2 * Math.PI), n *= 2, n < 1 ? -0.5 * (e * Math.pow(2, 10 * (n -= 1)) * Math.sin((n - t) * (2 * Math.PI) / s)) : e * Math.pow(2, -10 * (n -= 1)) * Math.sin((n - t) * (2 * Math.PI) / s) * 0.5 + 1);
}, It = (n) => n === 1 ? 1 : n * n * ((1.70158 + 1) * n - 1.70158), Bt = (n) => n === 0 ? 0 : --n * n * ((1.70158 + 1) * n + 1.70158) + 1, Ae = (n) => {
  const t = 2.5949095;
  return n *= 2, n < 1 ? 0.5 * (n * n * ((t + 1) * n - t)) : 0.5 * ((n -= 2) * n * ((t + 1) * n + t) + 2);
}, Y = (n) => 1 - F(1 - n), F = (n) => n < 1 / 2.75 ? 7.5625 * n * n : n < 2 / 2.75 ? 7.5625 * (n -= 1.5 / 2.75) * n + 0.75 : n < 2.5 / 2.75 ? 7.5625 * (n -= 2.25 / 2.75) * n + 0.9375 : 7.5625 * (n -= 2.625 / 2.75) * n + 0.984375, ve = (n) => n < 0.5 ? Y(n * 2) * 0.5 : F(n * 2 - 1) * 0.5 + 0.5, ye = (n) => n <= 0 ? 0 : n * n * (3 - 2 * n), we = (n) => n <= 0 ? 0 : n * n * n * (n * (n * 6 - 15) + 10), p = (n, t) => (e) => e < 0.5 ? t(e * 2) / 2 : n(2 * e - 1) / 2 + 0.5, Te = p(dt, _t), Se = p(pt, gt), Me = p(ft, mt), be = p(At, vt), xe = p(yt, wt), Ce = p(Tt, St), Ie = p(Mt, bt), Be = p(xt, Ct), Oe = p(It, Bt), Ee = p(Y, F), it = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  backIn: It,
  backInOut: Ae,
  backOut: Bt,
  backOutIn: Oe,
  bounceIn: Y,
  bounceInOut: ve,
  bounceOut: F,
  bounceOutIn: Ee,
  circIn: Mt,
  circInOut: fe,
  circOut: bt,
  circOutIn: Ie,
  constant: ce,
  cubicIn: pt,
  cubicInOut: ue,
  cubicOut: gt,
  cubicOutIn: Se,
  elasticIn: xt,
  elasticInOut: me,
  elasticOut: Ct,
  elasticOutIn: Be,
  expoIn: Tt,
  expoInOut: ge,
  expoOut: St,
  expoOutIn: Ce,
  fade: we,
  linear: he,
  quadIn: dt,
  quadInOut: le,
  quadOut: _t,
  quadOutIn: Te,
  quartIn: ft,
  quartInOut: de,
  quartOut: mt,
  quartOutIn: Me,
  quintIn: At,
  quintInOut: _e,
  quintOut: vt,
  quintOutIn: be,
  sineIn: yt,
  sineInOut: pe,
  sineOut: wt,
  sineOutIn: xe,
  smooth: ye
}, Symbol.toStringTag, { value: "Module" })), De = (n) => {
  const t = n.charAt(0);
  if (/[A-Z]/.test(t)) {
    n = n.replace(t, t.toLowerCase());
    const e = n.split("-");
    if (e.length === 2) {
      const s = e[0];
      if (s === "linear")
        n = "linear";
      else {
        const i = e[1];
        switch (s) {
          case "quadratic":
            n = `quad${i}`;
            break;
          case "quartic":
            n = `quart${i}`;
            break;
          case "quintic":
            n = `quint${i}`;
            break;
          case "sinusoidal":
            n = `sine${i}`;
            break;
          case "exponential":
            n = `expo${i}`;
            break;
          case "circular":
            n = `circ${i}`;
            break;
          default:
            n = s + i;
            break;
        }
      }
    }
  }
  return n;
};
class D extends h {
  constructor(t, e, s) {
    if (super(), s == null)
      s = /* @__PURE__ */ Object.create(null);
    else if (s.easing && typeof s.easing == "string" && (s.easing = De(s.easing)), s.progress || (s.progress = this.progress), s.easing && typeof s.easing == "string") {
      const i = s.easing;
      s.easing = it[i];
    }
    this._opts = s, this._props = /* @__PURE__ */ Object.create(null);
    for (const i in e) {
      if (!e.hasOwnProperty(i)) continue;
      let r = e[i];
      if (typeof r == "function" && (r = r()), r == null || typeof r == "string") continue;
      let a, c;
      r.value !== void 0 && (r.easing || r.progress) && (typeof r.easing == "string" ? a = it[r.easing] : a = r.easing, c = r.progress, r = r.value);
      const o = /* @__PURE__ */ Object.create(null);
      o.value = r, o.easing = a, o.progress = c, this._props[i] = o;
    }
    this._originProps = e, this.initWithDuration(t);
  }
  clone() {
    const t = new D(this._duration, this._originProps, this._opts);
    return this.cloneDecoration(t), t;
  }
  startWithTarget(t) {
    h.prototype.startWithTarget.call(this, t);
    const e = !!this._opts.relative, s = this._props;
    for (const i in s) {
      const r = t[i];
      if (r === void 0)
        continue;
      const a = s[i], c = a.value;
      if (typeof r == "number")
        a.start = r, a.current = r, a.end = e ? r + c : c;
      else if (typeof r == "object") {
        a.start == null && (a.start = {}, a.current = {}, a.end = {});
        for (const o in c)
          isNaN(r[o]) || (a.start[o] = r[o], a.current[o] = r[o], a.end[o] = e ? r[o] + c[o] : c[o]);
      }
    }
    this._opts.onStart && this._opts.onStart(this.target);
  }
  update(t) {
    const e = this.target;
    if (!e) return;
    const s = this._props, i = this._opts;
    let r = t;
    i.easing && (r = i.easing(t));
    const a = i.progress;
    for (const c in s) {
      const o = s[c], g = o.easing ? o.easing(t) : r, u = o.progress ? o.progress : a, _ = o.start, M = o.end;
      if (typeof _ == "number")
        o.current = u(_, M, o.current, g);
      else if (typeof _ == "object")
        for (const A in _)
          o.current[A] = u(_[A], M[A], o.current[A], g);
      e[c] = o.current;
    }
    i.onUpdate && i.onUpdate(this.target, t), t === 1 && i.onComplete && i.onComplete(this.target);
  }
  progress(t, e, s, i) {
    return t + (e - t) * i;
  }
}
class J extends I {
  constructor(t) {
    super(), this._props = {}, t !== void 0 && this.init(t);
  }
  init(t) {
    for (const e in t)
      this._props[e] = t[e];
    return !0;
  }
  update() {
    const t = this._props, e = this.target;
    for (const s in t)
      e[s] = t[s];
  }
  clone() {
    const t = new J();
    return t.init(this._props), t;
  }
}
const d = class d {
  constructor(t) {
    this._actions = [], this._finalAction = null, this._target = null, this._tag = -1, this._target = t === void 0 ? null : t;
  }
  set tag(t) {
    this._tag = t;
  }
  then(t) {
    return t instanceof m ? this._actions.push(t.clone()) : this._actions.push(t._union()), this;
  }
  target(t) {
    return this._target = t, this;
  }
  start() {
    return this._target ? (this._finalAction && f.instance.ActionManager.removeAction(this._finalAction), this._finalAction = this._union(), this._finalAction.tag = this._tag, f.instance.ActionManager.addAction(this._finalAction, this._target, !1), this) : (console.warn("Please set target to tween first"), this);
  }
  stop() {
    return this._finalAction && f.instance.ActionManager.removeAction(this._finalAction), this;
  }
  clone(t) {
    const e = this._union();
    return new d(t).then(e.clone());
  }
  union() {
    const t = this._union();
    return this._actions.length = 0, this._actions.push(t), this;
  }
  to(t, e, s) {
    s = s || /* @__PURE__ */ Object.create(null), s.relative = !1;
    const i = new D(t, e, s);
    return this._actions.push(i), this;
  }
  from(t, e, s) {
    s = s || /* @__PURE__ */ Object.create(null), s.relative = !0;
    const i = new D(t, e, s);
    return this._actions.push(i), this;
  }
  set(t) {
    const e = new J(t);
    return this._actions.push(e), this;
  }
  delay(t) {
    const e = new T(t);
    return this._actions.push(e), this;
  }
  call(t) {
    const e = new H(t);
    return this._actions.push(e), this;
  }
  sequence(...t) {
    const e = d._wrappedSequence(...t);
    return this._actions.push(e), this;
  }
  parallel(...t) {
    const e = d._wrappedParallel(...t);
    return this._actions.push(e), this;
  }
  repeat(t, e) {
    if (t === 1 / 0)
      return this.repeatForever(e);
    const s = this._actions;
    let i;
    e instanceof d ? i = e._union() : i = s.pop();
    const r = new O(i, t);
    return s.push(r), this;
  }
  repeatForever(t) {
    const e = this._actions;
    let s;
    t instanceof d ? s = t._union() : s = e.pop();
    const i = new E(s);
    return e.push(i), this;
  }
  reverseTime(t) {
    const e = this._actions;
    let s;
    t instanceof d ? s = t._union() : s = e.pop();
    const i = new X(s);
    return e.push(i), this;
  }
  static stopAll() {
    f.instance.ActionManager.removeAllActions();
  }
  static stopAllByTag(t, e) {
    f.instance.ActionManager.removeAllActionsByTag(t, e);
  }
  static stopAllByTarget(t) {
    f.instance.ActionManager.removeAllActionsFromTarget(t);
  }
  _union() {
    const t = this._actions;
    let e;
    return t.length === 1 ? e = t[0] : e = $(t), e;
  }
  static _wrappedSequence(...t) {
    const e = d._tmp_args;
    e.length = 0;
    for (let s = t.length, i = 0; i < s; i++) {
      const r = e[i] = t[i];
      r instanceof d && (e[i] = r._union());
    }
    return $.apply($, e);
  }
  static _wrappedParallel(...t) {
    const e = d._tmp_args;
    e.length = 0;
    for (let s = t.length, i = 0; i < s; i++) {
      const r = e[i] = t[i];
      r instanceof d && (e[i] = r._union());
    }
    return st.apply(st, e);
  }
};
d._tmp_args = [];
let nt = d;
class qe {
  constructor(t) {
    this._viewBuilder = t;
  }
  init(t) {
    return this._view = this._viewBuilder.create(this.setup(), t), this._view;
  }
  destroy() {
    this._view.destroy({ children: !0 });
  }
}
class rt {
  constructor(t, e, s) {
    this._pixi = t, this._viewBuilder = e, this._layers = s;
  }
  setScene(t) {
    var i;
    const e = this._pixi.stage.getChildByName("Scene");
    if (!e) return;
    (i = this._currentScene) == null || i.destroy();
    const s = new t(this._viewBuilder);
    s.init(e), this._currentScene = s, this._layers.sortAll();
  }
  addLayer(t) {
    this._layers.createGroups(t.name, t.order || 0, t.sortable || !1);
  }
  setShared(t) {
    const e = this._pixi.stage.getChildByName("Shared");
    e.removeChildren(), this._viewBuilder.create(t, e);
  }
  removeFromShared(t) {
    const s = this._pixi.stage.getChildByName("Shared").getChildByName(t, !0);
    s && s.destroy({ children: !0 });
  }
}
class at {
  constructor(t, e, s) {
    this._updateLoop = t, this._signalController = e, this._spineController = s, this._paused = !1, this._gameSpeed = 1;
  }
  /**
   * @description is game paused
   */
  get paused() {
    return this._paused;
  }
  /**
   * @description game speed multiplier
   */
  get gameSpeed() {
    return this._gameSpeed;
  }
  /**
   * @description pause all game logic - Systems, UpdateLoop and Spine.
   */
  pause() {
    this._paused = !0, this._updateLoop.pause(this._paused), this._signalController.pause(), this._spineController.pauseAll();
  }
  /**
   * @description resume all game logic - Systems, UpdateLoop and Spine.
   */
  resume() {
    this._paused = !1, this._updateLoop.pause(this._paused), this._signalController.resume(), this._spineController.resumeAll();
  }
  /**
   * @description set game speed - UpdateLoop and Spine.
   */
  setGameSpeed(t) {
    this._gameSpeed = t, this._updateLoop.setSpeedMultiplier(this._gameSpeed), this._spineController.multyplyTimeScaleAll(this._gameSpeed);
  }
}
class ze extends Rt {
  connectRender(t, e) {
    this.registerGlobalServices([{ provide: U, useFactory: () => t }]), this.appendToDOM(t, e), this.connectDebugger(t);
  }
  init() {
    super.init();
    const t = l.instance.get(U);
    this.initializeDependencies(t);
    const e = l.instance.get(Q), s = l.instance.get(z);
    this.createStage(t), this.createRootView("Scene", t), this.createRootView("Shared", t), e.addUpdateCallback((i) => this.update(i, s));
  }
  update(t, e) {
    e.update(t), f.instance.update(t);
  }
  appendToDOM(t, e) {
    e.appendChild(t.view);
  }
  connectDebugger(t) {
    globalThis.__PIXI_APP__ = t;
  }
  initializeDependencies(t) {
    const e = new x(), s = new j(e), i = new G(), r = new k(e), a = new B(), c = new z(), o = new N(), g = new tt(), u = new et(), _ = new rt(t, s, a), M = l.instance.get(Q), A = l.instance.get(qt), w = new at(M, A, o);
    this.registerGlobalServices([
      { provide: x, useFactory: () => e },
      { provide: j, useFactory: () => s },
      { provide: G, useFactory: () => i },
      { provide: k, useFactory: () => r },
      { provide: B, useFactory: () => a },
      { provide: z, useFactory: () => c },
      { provide: N, useFactory: () => o },
      { provide: tt, useFactory: () => g },
      { provide: et, useFactory: () => u },
      { provide: rt, useFactory: () => _ },
      { provide: at, useFactory: () => w }
    ]);
  }
  createStage(t) {
    const e = l.instance.get(B), s = new Ot.Stage();
    s.sortableChildren = !0, t.stage = s, t.stage.x = t.view.width / 2, t.stage.y = t.view.height / 2, e.setStage(s), e.sortAll();
  }
  createRootView(t, e) {
    const s = new b();
    s.name = t, e.stage.addChild(s);
  }
}
export {
  Zt as Asset,
  L as AssetStatus,
  x as AssetsManager,
  at as FlowController,
  B as Layers,
  k as Loader,
  ze as MyshPixiApp,
  ne as ObjectPool,
  Yt as OnViewCreatedSignal,
  z as ParticleEmitter,
  Jt as PixiEntity,
  Re as PixiItemPoolFactory,
  et as PoolsController,
  qe as Scene,
  rt as SceneController,
  N as SpineController,
  tt as SpineUtils,
  nt as Tween,
  D as TweenAction,
  f as TweenSystem,
  j as ViewBuilder,
  G as ViewEntity
};
