const { apiFetch } = require("./apiClient");

document.addEventListener("DOMContentLoaded", () => {
  const cursosContainer = document.getElementById("cursos-container");
  const cursoModal = document.getElementById("curso-modal");
  const modalContent = document.getElementById("modal-content");
  const closeButtons = document.querySelectorAll(".close");
  const filtrosModal = document.getElementById("filtros-modal");
  const formFiltros = document.getElementById("form-filtros");
  const buscaRapidaInput = document.getElementById("busca-rapida");
  const btnBuscaRapida = document.getElementById("btn-busca-rapida");
  const btnFiltrosAvancados = document.getElementById("btn-filtros-avancados");
  const btnLimparFiltros = document.getElementById("limpar-filtros");
  const btnNovoCurso = document.getElementById("btn-novo-curso");
  const btnListarCursos = document.getElementById("btn-listar-cursos");

  let estado = {
    pagina: 1,
    limite: 10,
    total: 0,
    filtros: {},
    cursos: [],
    cursoEditando: null,
  };

  carregarCursos();
  setupEventListeners();

  function setupEventListeners() {
    btnNovoCurso.addEventListener("click", () => abrirFormularioCurso());
    btnListarCursos.addEventListener("click", () => limparFiltros());

    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        cursoModal.style.display = "none";
        filtrosModal.style.display = "none";
      });
    });

    window.addEventListener("click", (event) => {
      if (event.target === cursoModal || event.target === filtrosModal) {
        cursoModal.style.display = "none";
        filtrosModal.style.display = "none";
      }
    });

    btnBuscaRapida.addEventListener("click", (e) => {
      e.preventDefault();
      aplicarBuscaRapida();
    });

    btnFiltrosAvancados.addEventListener(
      "click",
      () => (filtrosModal.style.display = "block")
    );
    formFiltros.addEventListener("submit", aplicarFiltrosAvancados);
    btnLimparFiltros.addEventListener("click", limparFiltros);
  }

  async function carregarCursos() {
    try {
      let url = "";

      if (estado.tipoBusca === "rapida") {
        const params = new URLSearchParams();
        if (estado.filtros.busca) {
          params.append("busca", estado.filtros.busca);
        }
        url = `cursos/search?${params.toString()}`;
      } else if (estado.tipoBusca === "avancada") {
        const params = new URLSearchParams({
          page: estado.pagina,
          limit: estado.limite,
          ...estado.filtros,
        });

        url = `cursos/search/advanced?${params.toString()}`;
      } else {
        const params = new URLSearchParams({
          page: String(estado.pagina),
          limit: String(estado.limite),
        });
        url = `cursos?${params.toString()}`;
      }

      const response = await apiFetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erro ao carregar cursos");
      }

      const data = await response.json();
      estado.cursos = data;
      renderCursos();
    } catch (error) {
      mostrarToast("Erro", error.message, false);
      console.error("Erro na busca:", error);
    }
  }

  async function exibirDetalhesCurso(id) {
    try {
      const response = await apiFetch(`cursos/${id}`);
      if (!response.ok) throw new Error("Curso não encontrado");

      const curso = await response.json();

      curso.data_lancamento = new Date(curso.data_lancamento)
        .toISOString()
        .split("T")[0];

      modalContent.innerHTML = `
                <div class="curso-detalhes">
                    <h2>${curso.titulo}</h2>
                    <p><strong>Instrutor:</strong> ${curso.instrutor}</p>
                    <p><strong>Categoria:</strong> ${curso.categoria}</p>
                    <p><strong>Duração:</strong> ${
                      curso.duracao_horas
                    } horas</p>
                    <p><strong>Preço:</strong> R$ ${curso.preco.toFixed(2)}</p>
                    <p><strong>Avaliação:</strong> ${
                      curso.avaliacao?.toFixed(1) || "N/A"
                    } / 5</p>
                    <p><strong>Alunos matriculados:</strong> ${
                      curso.alunos_matriculados
                    }</p>
                    <p><strong>Lançamento:</strong> ${curso.data_lancamento}</p>
                    <div><strong>Módulos:</strong>
                        <ul>${curso.modulos
                          .map((modulo) => `<li>${modulo}</li>`)
                          .join("")}</ul>
                    </div>
                </div>
            `;

      cursoModal.style.display = "block";
    } catch (error) {
      mostrarToast("Erro", error.message, false);
    }
  }

  function renderCursos() {
    if (estado.cursos.length === 0) {
      cursosContainer.innerHTML = `
            <div class="sem-cursos-container">
                <p class="sem-cursos-texto">Nenhum curso encontrado.</p>
                <button id="btn-voltar-lista" class="btn-voltar-lista">Voltar para lista</button>
            </div>
            `;
      return;
    }

    cursosContainer.innerHTML = estado.cursos
      .map(
        (curso) => `
            <div class="curso-card">
                <div class="curso-info">
                    <h3 class="curso-titulo" data-id="${
                      curso._id
                    }" style="cursor:pointer;color:#0077cc;text-decoration:underline;">
                        ${curso.titulo}
                    </h3>
                    <p>${curso.duracao_horas}h • ${curso.categoria}</p>
                    <p class="curso-preco">R$ ${curso.preco.toFixed(2)}</p>
                    <div class="curso-acoes">
                        <button class="btn-editar" data-id="${
                          curso._id
                        }">Editar</button>
                        <button class="btn-excluir" data-id="${
                          curso._id
                        }">Excluir</button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");

    document.querySelectorAll(".curso-titulo").forEach((titulo) => {
      titulo.addEventListener("click", (e) => {
        const cursoId = e.target.dataset.id;
        exibirDetalhesCurso(cursoId);
      });
    });

    document.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const cursoId = e.target.dataset.id;
        await carregarCursoParaEdicao(cursoId);
      });
    });

    document.querySelectorAll(".btn-excluir").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const cursoId = e.target.dataset.id;
        if (confirm("Tem certeza que deseja excluir este curso?")) {
          await excluirCurso(cursoId);
        }
      });
    });
  }

  async function carregarCursoParaEdicao(id) {
    try {
      const response = await apiFetch(`cursos/${id}`);
      if (!response.ok) throw new Error("Erro ao carregar curso");

      estado.cursoEditando = await response.json();
      abrirFormularioCurso(estado.cursoEditando);
    } catch (error) {
      mostrarToast("Erro", error.message, false);
    }
  }

  function abrirFormularioCurso(curso = null) {
    const isEditando = !!curso;
    const cursoData = curso || {
      titulo: "",
      instrutor: "",
      categoria: "Tecnologia",
      duracao_horas: 0,
      preco: 0,
      avaliacao: 0,
      alunos_matriculados: 0,
      data_lancamento: new Date().toISOString().split("T")[0],
      modulos: [],
    };

    const dataLancamento = isEditando
      ? new Date(cursoData.data_lancamento).toISOString().split("T")[0]
      : cursoData.data_lancamento;

    modalContent.innerHTML = `
            <h2>${isEditando ? "Editar" : "Novo"} Curso</h2>
            <form id="form-curso">
                <input type="hidden" id="curso-id" value="${
                  cursoData._id || ""
                }">
                
                <div class="form-group">
                    <label>Título:</label>
                    <input type="text" id="curso-titulo" value="${
                      cursoData.titulo
                    }" required>
                </div>
                
                <div class="form-group">
                    <label>Instrutor:</label>
                    <input type="text" id="curso-instrutor" value="${
                      cursoData.instrutor
                    }" required>
                </div>
                
                <div class="form-group">
                    <label>Categoria:</label>
                    <select id="curso-categoria" required>
                        ${[
                          "Tecnologia",
                          "Negócios",
                          "Design",
                          "Marketing",
                          "Saúde",
                          "Desenvolvimento Pessoal",
                          "Fotografia",
                          "Música",
                        ]
                          .map(
                            (opcao) =>
                              `<option ${
                                cursoData.categoria === opcao ? "selected" : ""
                              }>${opcao}</option>`
                          )
                          .join("")}
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Duração (horas):</label>
                    <input type="number" id="curso-duracao" step="0.1" 
                        value="${cursoData.duracao_horas}" required>
                </div>
                
                <div class="form-group">
                    <label>Preço (R$):</label>
                    <input type="number" id="curso-preco" step="0.01" 
                        value="${cursoData.preco}" required>
                </div>
                
                <div class="form-group">
                    <label>Avaliação (0-5):</label>
                    <input type="number" id="curso-avaliacao" min="0" max="5" step="0.1" 
                        value="${cursoData.avaliacao || 0}">
                </div>
                
                <div class="form-group">
                    <label>Alunos Matriculados:</label>
                    <input type="number" id="curso-alunos" 
                        value="${cursoData.alunos_matriculados || 0}">
                </div>
                
                <div class="form-group">
                    <label>Data de Lançamento:</label>
                    <input type="date" id="curso-data" 
                        value="${dataLancamento}" required>
                </div>
                
                <div class="form-group">
                    <label>Módulos (separados por vírgula):</label>
                    <textarea id="curso-modulos" required>${
                      cursoData.modulos.join(", ") || ""
                    }</textarea>
                </div>
                
                <div class="form-buttons">
                    <button type="submit">Salvar</button>
                    <button type="button" id="btn-cancelar">Cancelar</button>
                </div>
            </form>
        `;

    document
      .getElementById("form-curso")
      .addEventListener("submit", salvarCurso);
    document
      .getElementById("btn-cancelar")
      .addEventListener("click", () => (cursoModal.style.display = "none"));
    cursoModal.style.display = "block";
  }

  async function salvarCurso(e) {
    e.preventDefault();

    const cursoData = {
      titulo: document.getElementById("curso-titulo").value,
      instrutor: document.getElementById("curso-instrutor").value,
      categoria: document.getElementById("curso-categoria").value,
      duracao_horas: parseFloat(document.getElementById("curso-duracao").value),
      preco: parseFloat(document.getElementById("curso-preco").value),
      avaliacao:
        parseFloat(document.getElementById("curso-avaliacao").value) || 0,
      alunos_matriculados:
        parseInt(document.getElementById("curso-alunos").value) || 0,
      data_lancamento: new Date(
        document.getElementById("curso-data").value
      ).toISOString(),
      modulos: document
        .getElementById("curso-modulos")
        .value.split(",")
        .map((m) => m.trim()),
    };

    try {
      const url = estado.cursoEditando
        ? `cursos/${estado.cursoEditando._id}`
        : "cursos";

      const method = estado.cursoEditando ? "PUT" : "POST";

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify(cursoData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.errors?.map((e) => e.msg).join(", ") || error.message
        );
      }

      mostrarToast(
        "Sucesso",
        `Curso ${estado.cursoEditando ? "atualizado" : "criado"} com sucesso!`,
        true
      );
      cursoModal.style.display = "none";
      await carregarCursos();
    } catch (error) {
      mostrarToast("Erro", error.message, false);
    }
  }

  async function excluirCurso(id) {
    try {
      const response = await apiFetch(`cursos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      mostrarToast("Sucesso", "Curso excluído com sucesso!", true);
      await carregarCursos();
    } catch (error) {
      mostrarToast("Erro", error.message, false);
    }
  }

  function aplicarBuscaRapida() {
    estado.tipoBusca = "rapida";
    estado.filtros = {
      busca: buscaRapidaInput.value.trim(),
    };
    estado.pagina = 1;
    carregarCursos();
  }

  async function aplicarFiltrosAvancados(e) {
    e.preventDefault();
    estado.tipoBusca = "avancada";

    const minPreco = document.getElementById("minPreco").value;
    const maxPreco = document.getElementById("maxPreco").value;
    const minAvaliacao = document.getElementById("minAvaliacao").value;
    const maxDuracao = document.getElementById("maxDuracao").value;
    const categoria = document.getElementById("categorias").value;
    const excluirCategorias =
      document.getElementById("excluirCategorias").value;
    const lancamentoApos = document.getElementById("lancamentoApos").value;

    try {
      const params = new URLSearchParams();
      if (minPreco) params.append("minPreco", minPreco);
      if (maxPreco) params.append("maxPreco", maxPreco);
      if (minAvaliacao) params.append("minAvaliacao", minAvaliacao);
      if (maxDuracao) params.append("minDuracao", maxDuracao);
      if (categoria) params.append("categoria", categoria);
      if (excluirCategorias)
        params.append("excluirCategorias", excluirCategorias);
      if (lancamentoApos) params.append("lancamentoApos", lancamentoApos);

      const response = await apiFetch(
        `cursos/search/advanced?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.errors?.map((e) => e.msg).join(", ") || data.message
        );
      }

      estado.cursos = data;
      estado.pagina = 1;
      filtrosModal.style.display = "none";
      renderCursos();
    } catch (error) {
      mostrarToast("Erro", error.message, false);
    }
  }

  function limparFiltros() {
    estado.filtros = {};
    formFiltros.reset();
    buscaRapidaInput.value = "";
    carregarCursos();
  }

  function atualizarPaginacao() {
    const totalPaginas = Math.ceil(estado.total / estado.limite);
    const paginacaoContainer = document.getElementById("paginacao-container");

    if (!paginacaoContainer) {
      const novaPaginacao = document.createElement("div");
      novaPaginacao.id = "paginacao-container";
      novaPaginacao.className = "paginacao";
      cursosContainer.after(novaPaginacao);
    }

    document.getElementById("paginacao-container").innerHTML = `
            <div class="controles-paginacao">
                <button class="btn-pagina ${
                  estado.pagina === 1 ? "disabled" : ""
                }" 
                    ${estado.pagina === 1 ? "disabled" : ""} id="btn-anterior">
                    Anterior
                </button>
                
                <span class="pagina-atual">Página ${
                  estado.pagina
                } de ${totalPaginas}</span>
                
                <button class="btn-pagina ${
                  estado.pagina === totalPaginas ? "disabled" : ""
                }" 
                    ${
                      estado.pagina === totalPaginas ? "disabled" : ""
                    } id="btn-proximo">
                    Próxima
                </button>
            </div>
        `;

    document.getElementById("btn-anterior")?.addEventListener("click", () => {
      if (estado.pagina > 1) {
        estado.pagina--;
        carregarCursos();
      }
    });

    document.getElementById("btn-proximo")?.addEventListener("click", () => {
      if (estado.pagina < totalPaginas) {
        estado.pagina++;
        carregarCursos();
      }
    });
    if (totalPaginas === 0) {
      document.getElementById("paginacao-container").innerHTML = "";
    }
  }

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
