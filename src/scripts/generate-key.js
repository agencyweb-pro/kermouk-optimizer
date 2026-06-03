#!/usr/bin/env node
// Générateur de clés de licence KERMOUK OPTIMIZER
// Usage : node generate-key.js [nombre]
// Exemples :
//   node generate-key.js        → génère 1 clé
//   node generate-key.js 5      → génère 5 clés
//   node generate-key.js 10 --save → génère 10 clés et les sauvegarde dans keys.txt

const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const count = parseInt(args.find((a) => !a.startsWith("--")) || "1", 10);
const doSave = args.includes("--save");

if (isNaN(count) || count < 1 || count > 1000) {
  console.error("Erreur : nombre de clés invalide (1–1000).");
  process.exit(1);
}

const keys = Array.from({ length: count }, () => randomUUID());

console.log("\n╔══════════════════════════════════════════════════════╗");
console.log("║        KERMOUK OPTIMIZER — Générateur de licences     ║");
console.log("╚══════════════════════════════════════════════════════╝\n");
console.log(`  ${count} clé(s) générée(s) :\n`);
keys.forEach((key, i) => {
  const num = String(i + 1).padStart(String(count).length, "0");
  console.log(`  [${num}]  ${key}`);
});
console.log();

if (doSave) {
  const outFile = path.join(__dirname, "keys.txt");
  const lines = keys.map((k, i) => `${i + 1}\t${k}`).join("\n");
  const header = `KERMOUK OPTIMIZER — Clés générées le ${new Date().toLocaleString("fr-FR")}\n${"─".repeat(60)}\n`;
  fs.appendFileSync(outFile, header + lines + "\n\n", "utf-8");
  console.log(`  ✓ Clés sauvegardées dans : ${outFile}\n`);
}
