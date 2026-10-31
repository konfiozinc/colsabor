const fs = require("node:fs");
const NS = "demo-sec-v5-default-rtdb";
(async () => {
  const reglas = JSON.parse(fs.readFileSync("database.rules.v5.candidata.json", "utf8"));
  const r = await fetch(`http://127.0.0.1:9000/.settings/rules.json?ns=${NS}&access_token=owner`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(reglas) });
  console.log("carga de database.rules.v5.candidata.json -> HTTP " + r.status + " " + (await r.text()).replace(/\s+/g, " ").slice(0, 40));
  const s = await fetch(`http://127.0.0.1:9000/menu_backup/x.json?ns=${NS}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ x: 1 }) });
  console.log("control escritura prohibida -> HTTP " + s.status + (s.status === 401 ? " (reglas activas ✓)" : " (revisar)"));
})().catch((e) => console.error("ERROR: " + e.message));
