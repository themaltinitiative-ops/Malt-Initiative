// Vérifie si l'utilisateur est connecté
function checkLogin() {
  if(sessionStorage.getItem('connected') !== 'true'){
    alert("Vous devez vous connecter !");
    window.location.href = "login.html";
  }
}

// Déconnexion
function logout() {
  sessionStorage.removeItem('connected');
  window.location.href = "login.html";
}

// Redirection vers home
function goHome() {
  window.location.href = "home.html";
}