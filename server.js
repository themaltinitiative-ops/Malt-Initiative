import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour JSON
app.use(express.json());

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Redirection de la racine vers login.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

// === Blockchain simplifiée ===
class Block {
  constructor(index, etape, description, previousHash = "") {
    this.index = index;
    this.etape = etape;
    this.description = description;
    this.timestamp = new Date().toLocaleString();
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return (
      this.index +
      this.previousHash +
      this.timestamp +
      this.etape +
      this.description
    )
      .split("")
      .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
      .toString(16);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, "Début du processus", "Lancement de la production", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(block) {
    block.previousHash = this.getLatestBlock().hash;
    block.hash = block.calculateHash();
    this.chain.push(block);
  }

  getChain() {
    return this.chain;
  }
}

const beerChain = new Blockchain();

// === Routes API ===

// Récupérer tous les blocs
app.get("/blocks", (req, res) => {
  res.json(beerChain.getChain());
});

// Ajouter un bloc
app.post("/add", (req, res) => {
  const { etape, description } = req.body;
  if (!etape || !description) {
    return res.status(400).json({ error: "Étape et description requises" });
  }

  const newBlock = new Block(
    beerChain.chain.length,
    etape,
    description,
    beerChain.getLatestBlock().hash
  );

  beerChain.addBlock(newBlock);
  res.json(newBlock);
});

// Redirection pour toutes les autres routes vers login.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
