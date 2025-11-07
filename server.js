import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Pour retrouver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware pour JSON
app.use(express.json());

// Servir le dossier frontend comme statique
app.use(express.static(path.join(__dirname, "frontend")));

// --- Blockchain simplifiée en mémoire ---
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

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
    return simpleHash(
      this.index + this.previousHash + this.timestamp + this.etape + this.description
    );
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
  addBlock(block) {
    block.previousHash = this.getLatestBlock().hash;
    block.hash = block.calculateHash();
    this.chain.push(block);
  }
}

const beerChain = new Blockchain();

// --- Routes API ---

// Ajouter un bloc
app.post("/add", (req, res) => {
  const { etape, description } = req.body;
  if (!etape || !description) {
    return res.status(400).json({ error: "Veuillez fournir l'étape et la description" });
  }
  const newBlock = new Block(beerChain.chain.length, etape, description);
  beerChain.addBlock(newBlock);
  res.json(newBlock);
});

// Récupérer tous les blocs
app.get("/blocks", (req, res) => {
  res.json(beerChain.chain);
});

// --- Route racine : afficher login/home ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

// Pour toutes les autres routes HTML de ton frontend
app.get("/:page", (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, "frontend", page));
});

// --- Lancer le serveur ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
