// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Blockchain simplifiée
class Block {
  constructor(index, etape, description, previousHash = "") {
    this.index = index;
    this.timestamp = new Date().toLocaleString();
    this.etape = etape;
    this.description = description;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    let str = this.index + this.previousHash + this.timestamp + this.etape + this.description;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(16);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "Début du processus", "Lancement de la production de la bière", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

const beerChain = new Blockchain();

// Routes API
app.get("/blocks", (req, res) => {
  res.json(beerChain.chain);
});

app.post("/add", (req, res) => {
  const { etape, description } = req.body;
  if (!etape || !description) return res.status(400).json({ error: "Champs manquants" });

  const newBlock = new Block(beerChain.chain.length, etape, description);
  beerChain.addBlock(newBlock);
  res.json(newBlock);
});

// Route par défaut vers login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

// Toutes les autres routes HTML (si tu veux que Render les trouve)
app.get("/:page", (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, "frontend", page));
});

// Démarrage du serveur
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
