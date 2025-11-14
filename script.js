async function fetchTasks() {
  const res = await fetch('/tasks');
  const tasks = await res.json();
  const list = document.getElementById('tasks');
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.title;
    li.onclick = () => editTask(task.id, task.title);
    li.oncontextmenu = async (e) => {
      e.preventDefault();
      await fetch(`/tasks/${task.id}`, { method: 'DELETE' });
      fetchTasks();
    };
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById('newTask');
  if(input.value.trim() === '') return;
  await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value })
  });
  input.value = '';
  fetchTasks();
}

async function editTask(id, oldTitle) {
  const newTitle = prompt('Editar tarea:', oldTitle);
  if(!newTitle) return;
  await fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle })
  });
  fetchTasks();
}

// Inicializar
fetchTasks();
