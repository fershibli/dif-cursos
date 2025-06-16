const windowUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : `https://${window.location.hostname}`;

document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000/api/usuarios"
      : `https://${window.location.hostname}/api/usuarios`;

  const btnLogin = document.getElementById("btn-login");
  const btnRegister = document.getElementById("btn-register");

  btnLogin.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      localStorage.setItem("token", data.token);

      window.location.href = windowUrl + "/cursos.html";
    } catch (error) {
      mostrarToast("Erro", error.message, false);
    }
  });

  btnRegister.addEventListener("click", () => {
    window.location.href = windowUrl + "/cadastro.html";
  });

  function mostrarToast(titulo, mensagem, sucesso) {
    const toast = document.createElement("div");
    toast.className = `toast ${sucesso ? "sucesso" : "erro"}`;
    toast.innerHTML = `
            <div class="toast-header">${titulo}</div>
            <div class="toast-body">${mensagem}</div>
        `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("show");
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }, 100);
  }
});
