const NS = "demo-sec-v5-default-rtdb";
(async () => {
  const r = await fetch(`http://127.0.0.1:9000/menu_backup/cert.json?ns=${NS}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ x: 1 }) });
  console.log("CONTROL: escritura anónima prohibida -> HTTP " + r.status + (r.status === 401 ? "  ✓ reglas v5 aplicándose" : "  ✗ reglas NO aplicadas"));
})().catch((e) => console.log("control no ejecutable: " + e.message.slice(0, 60)));
