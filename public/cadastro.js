const windowUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/"
    : `https://${window.location.hostname}/`;

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

document
  .getElementById("cadastro-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    const userData = {
      nome: name,
      email: email,
      senha: senha,
    };

    try {
      const response = await apiFetch("/usuarios/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      console.log("Response:", response);
      if (!response.ok) {
        const errorData = await response.json();
        let allErrors = "";
        for (let i = 0; i < errorData.errors.length; i++) {
          const error = errorData.errors[i];
          allErrors += `${error.msg}\n`;
        }
        throw new Error(allErrors || "Erro ao realizar o cadastro");
      } else {
        const data = await response.json();
        console.log("Cadastro realizado com sucesso:", data);
        mostrarToast("Sucesso", "Cadastro realizado com sucesso!", true);
        window.location.href = windowUrl;
      }
    } catch (error) {
      console.error("Erro:", error);
      mostrarToast(
        "Erro ao realizar o cadastro.\n" + error,
        "\nTente novamente.",
        false
      );
    }
  });
