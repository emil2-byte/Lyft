/* Engine test: run the app's own plan/progression code in Node with a stubbed DOM,
   and print what the plan says week after week. */
const fs = require("fs");
const vm = require("vm");

const html = fs.readFileSync("../index.html", "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

const el = () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, textContent: "", className: "", innerHTML: "", onclick: null, onchange: null, value: "", querySelectorAll: () => [], querySelector: el, click() {}, addEventListener() {} });
global.document = {
  getElementById: el, querySelector: () => null, querySelectorAll: () => [],
  createElement: el, addEventListener() {},
};
global.navigator = { vibrate() {}, clipboard: { writeText() {} } };
global.location = { protocol: "http:" };
global.confirm = () => true;
const mem = {};
global.localStorage = { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = v; } };

vm.runInThisContext(script, { filename: "lyft-app.js" });

const day = (n) => {
  const d = new Date(2026, 10, 18 + n); // from 18 Nov 2026
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};

function nextSession(step, skip) {
  const p = currentPlan();
  const head = `${p.title}${p.deload ? " [DELOAD]" : ""}`;
  const sets = [];
  p.blocks.forEach((b) => {
    const kgv = blockKg(b);
    for (let i = 0; i < b.sets; i++) {
      const t = setTarget(b, i);
      // optionally miss the last set of the last block to test the stall rule
      const reps = (skip && i === b.sets - 1 && b.lane === "squat") ? t - 2 : t;
      sets.push({ ex: b.ex, lane: b.lane, kg: kgv, reps, target: t, rpe: null, ts: Date.now() });
    }
  });
  S.cur = { date: day(step), day: p.title, phase: S.settings.phase, sets, note: "" };
  const line = p.blocks.map((b) => `${EX[b.ex].name}${b.sub ? "/" + b.sub : ""} ${schemeLabel(b)} @ ${blockKg(b)}kg (${nextFor(b)})`).join("\n      ");
  console.log(`\n--- ${day(step)}  ${head}`);
  console.log("      " + line);
  finishSession();
  return p;
}

console.log("=== RECOVERY: 16 sessions, all sets hit ===");
for (let i = 1; i <= 26; i++) nextSession(i * 2, false);
console.log("\nphase hint now:", JSON.stringify(phaseHint()));

console.log("\n\n=== switch to BUILD ===");
setPhase("build");
for (let i = 0; i < 12; i++) nextSession(40 + i * 2, i === 3);   // session 4: squat misses -> stall rule

console.log("\n=== pull-ups state ===", S.w.pullupReps, "reps target,", S.w.pullupKg, "kg added");
console.log("=== best e1RM === squat", Math.round(bestEpley("squat")), "bench", Math.round(bestEpley("bench")), "dl", Math.round(bestEpley("deadlift")));
console.log("=== recovery % ===", ["squat", "bench", "deadlift"].map((k) => k + " " + Math.round(bestEpley(k) / S.settings.ref[k] * 100) + "%").join(", "));

console.log("\n\n=== switch to STRENGTH ===");
setPhase("strength");
for (let i = 0; i < 9; i++) nextSession(100 + i * 2, false);

console.log("\n=== deload sessions are excluded from progression history ===");
console.log("squat lane history:", laneRecs("squat").slice(-6).map((r) => r.kg).join(" -> "));
console.log("total sessions:", S.done.length, "| deloads:", S.done.filter((s) => s.deload).length);
console.log("\nOK");

fs.writeFileSync("state.json", JSON.stringify(S));
console.log("WRITTEN state.json: " + S.done.length + " sessions, phase " + S.settings.phase + ", cur date " + (S.cur && S.cur.date));
console.log("HINT:", JSON.stringify(phaseHint()));
