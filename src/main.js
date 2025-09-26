import "./style.css";

// localStorage
const getTasks = () => JSON.parse(localStorage.getItem("tasks")) || [];
const saveTasks = (tasks) =>
  localStorage.setItem("tasks", JSON.stringify(tasks));

// Elementos
const taskTable = document.getElementById("taskTable");
const btnNovaTarefa = document.getElementById("btnNovaTarefa");
const modalNova = document.getElementById("modalNova");
const modalConfirm = document.getElementById("modalConfirm");
const tituloInput = document.getElementById("titulo");
const descricaoInput = document.getElementById("descricao");
const salvarTarefaBtn = document.getElementById("salvarTarefa");
const cancelarNovaBtn = document.getElementById("cancelarNova");
const confirmMessage = document.getElementById("confirmMessage");
const cancelConfirmBtn = document.getElementById("cancelConfirm");
const okConfirmBtn = document.getElementById("okConfirm");
const clock = document.getElementById("clock");
const toggleThemeBtn = document.getElementById("toggleTheme");

let actionType = null;
let actionId = null;
let filter = "all";

// Relógio
setInterval(() => {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString("pt-BR");
}, 1000);

// Listar tarefas
function renderTasks() {
  const tasks = getTasks();
  taskTable.innerHTML = "";

  tasks
    .filter((task) => {
      if (filter === "pending") return task.status === "Pendente";
      if (filter === "done") return task.status === "Concluída";
      return true;
    })
    .forEach((task, index) => {
      const isDone = task.status === "Concluída";
      const row = document.createElement("tr");

      row.className = isDone
        ? "bg-green-100 text-gray-500 line-through" // estilo concluída
        : "bg-white dark:bg-gray-800"; // estilo normal

      row.innerHTML = `
        <td class="p-2">${task.titulo}</td>
        <td class="p-2">${task.descricao}</td>
        <td class="p-2">${task.data}</td>
        <td class="p-2">${task.status}</td>
        <td class="p-2 space-x-2">
          ${
            !isDone
              ? `<button class="concluir px-2 py-1 bg-green-500 text-white rounded" data-id="${index}">Concluir</button>`
              : ""
          }
          <button class="excluir px-2 py-1 bg-red-500 text-white rounded" data-id="${index}">Excluir</button>
        </td>
      `;
      taskTable.appendChild(row);
    });
}

// Modal Nova
btnNovaTarefa.addEventListener("click", () => {
  modalNova.classList.remove("hidden");
});

cancelarNovaBtn.addEventListener("click", () => {
  modalNova.classList.add("hidden");
});

// Salvar nova tarefa
salvarTarefaBtn.addEventListener("click", () => {
  const titulo = tituloInput.value.trim();
  const descricao = descricaoInput.value.trim();

  if (!titulo) return alert("Digite um título!");

  const tasks = getTasks();
  tasks.push({
    titulo,
    descricao,
    data: new Date().toLocaleString("pt-BR"),
    status: "Pendente",
  });
  saveTasks(tasks);
  renderTasks();

  tituloInput.value = "";
  descricaoInput.value = "";
  modalNova.classList.add("hidden");
});

// Modal Confirmar
taskTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("excluir")) {
    actionType = "delete";
    actionId = e.target.dataset.id;
    confirmMessage.textContent = "Deseja realmente excluir esta tarefa?";
    modalConfirm.classList.remove("hidden");
  }

  if (e.target.classList.contains("concluir")) {
    actionType = "done";
    actionId = e.target.dataset.id;
    confirmMessage.textContent = "Deseja marcar esta tarefa como concluída?";
    modalConfirm.classList.remove("hidden");
  }
});

cancelConfirmBtn.addEventListener("click", () => {
  modalConfirm.classList.add("hidden");
});

okConfirmBtn.addEventListener("click", () => {
  let tasks = getTasks();
  if (actionType === "delete") {
    tasks.splice(actionId, 1);
  }
  if (actionType === "done") {
    tasks[actionId].status = "Concluída";
  }
  saveTasks(tasks);
  renderTasks();
  modalConfirm.classList.add("hidden");
});

// Filtros
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    renderTasks();
  });
});

// Tema
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleTheme");
  if (!toggle) {
    console.error("toggleTheme não encontrado");
    return;
  }

  const applyDark = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark"); // redundância pra casos de CSS custom
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  };

  const saved = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialDark = saved === "dark" || (!saved && prefersDark);

  applyDark(initialDark);
  toggle.checked = initialDark;

  toggle.addEventListener("change", () => {
    const isNowDark = toggle.checked;
    applyDark(isNowDark);
    localStorage.setItem("theme", isNowDark ? "dark" : "light");
    console.log("Tema alterado para", isNowDark ? "dark" : "light");
  });
});

// Inicialização
renderTasks();
