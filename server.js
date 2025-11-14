const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL // variable de entorno en Railway
});

app.use(bodyParser.json());
app.use(express.static('public'));

// Obtener todas las tareas
app.get('/tasks', async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
  res.json(result.rows);
});

// Obtener una tarea por id
app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  res.json(result.rows[0]);
});

// Agregar tarea
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  const result = await pool.query('INSERT INTO tasks (title) VALUES ($1) RETURNING *', [title]);
  res.json(result.rows[0]);
});

// Editar tarea
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const result = await pool.query('UPDATE tasks SET title=$1 WHERE id=$2 RETURNING *', [title, id]);
  res.json(result.rows[0]);
});

// Eliminar tarea
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM tasks WHERE id=$1', [id]);
  res.json({ message: 'Tarea eliminada' });
});

app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));
