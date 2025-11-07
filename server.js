import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques (CSS, JS)
app.use(express.static(path.join(__dirname, "frontend")));

// Routes pour chaque page HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

app.get("/blockchain", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "blockchain.html"));
});

app.get("/blockDetails", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "blockDetails.html"));
});

// Endpoint simple pour test
app.get("/api/test", (req, res) => {
  res.json({ message: "Le serveur fonctionne !" });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send("Page introuvable");
});

// Exemple d’API pour ajouter un bloc (placeholder)
let blockchain = []; // ici tu peux mettre ta blockchain réelle
app.post("/add", (req, res) => {
  const { etape, description } = req.body;
  if (!etape || !description) {
    return res.status(400).json({ error: "Etape et description obligatoires" });
  }
  const newBlock = {
    index: blockchain.length,
    etape,
    description,
    timestamp: new Date().toLocaleString(),
    hash: Math.random().toString(36).substring(2, 10),
    previousHash: blockchain.length ? blockchain[blockchain.length - 1].hash : "0",
  };
  blockchain.push(newBlock);
  res.json(newBlock);
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
