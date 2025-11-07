checkLogin();

const container = document.querySelector(".blockchain");
const addBtn = document.getElementById("addBlockBtn");

async function loadBlocks() {
  try {
    const res = await fetch("http://localhost:3000/blocks");
    const blocks = await res.json();

    container.innerHTML = "";
    blocks.forEach(block => {
      const div = document.createElement("div");
      div.className = "block";
      div.innerHTML = `<h3>${block.etape}</h3><p>${block.description}</p>`;
      div.onclick = () => window.location.href = `block.html?index=${block.index}`;
      container.appendChild(div);
    });
  } catch(err) { console.error(err); alert("Erreur chargement blockchain"); }
}

addBtn.addEventListener("click", async () => {
  const etape = document.getElementById("etape").value.trim();
  const description = document.getElementById("description").value.trim();
  if(!etape || !description) { alert("Merci de renseigner l'étape et la description !"); return; }

  try {
    const res = await fetch("http://localhost:3000/blocks", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({etape, description})
    });
    if(!res.ok) throw new Error("Erreur ajout bloc");
    document.getElementById("etape").value = "";
    document.getElementById("description").value = "";
    await loadBlocks();
  } catch(err) { console.error(err); alert("Impossible d'ajouter le bloc"); }
});

loadBlocks();