// server.js
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("frontend")); // sert les fichiers HTML/CSS/JS

// Chemin du fichier JSON pour stocker la blockchain
const DATA_DIR = path.join(".", "data");
const DATA_PATH = path.join(DATA_DIR, "blocks.json");

// Crée le dossier et le fichier JSON si non existants
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify([]));

// --- Routes ---

// Retourne tous les blocs
app.get("/blocks", (req, res) => {
  try {
    const blocks = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    res.json(blocks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de lire les blocs" });
  }
});

// Ajouter un nouveau bloc
app.post("/add", (req, res) => {
  try {
    const { etape, description } = req.body;
    if (!etape || !description) return res.status(400).json({ error: "Données manquantes" });

    const blocks = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));

    const previousHash = blocks.length ? blocks[blocks.length - 1].hash : "0";
    const index = blocks.length ? blocks[blocks.length - 1].index + 1 : 0;
    const timestamp = new Date().toLocaleString();

    // Hash simplifié
    const hash = (index + previousHash + timestamp + etape + description)
                   .split("")
                   .reduce((a,b)=>((a<<5)-a+b.charCodeAt(0))|0,0)
                   .toString(16);

    const newBlock = { index, etape, description, timestamp, hash, previousHash };

    blocks.push(newBlock);
    fs.writeFileSync(DATA_PATH, JSON.stringify(blocks, null, 2));

    res.json(newBlock);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible d'ajouter le bloc" });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});