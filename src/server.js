import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';

var fakeTodos = [{
  id: 'ae06181d',
  text: 'Learn about React Ecosystems',
  isCompleted: false,
  createdAt: new Date()
}, {
  id: 'cda9165d',
  text: 'Get together with friends',
  isCompleted: false,
  createdAt: new Date(Date.now() - 86400000 * 7)
}, {
  id: '2e538cc5',
  text: 'Buy groceris',
  isCompleted: true,
  createdAt: new Date(Date.now() - 86400000 * 14)
}, ];

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

// The route for getting a list of all todos

app.get('/todos', (req, res) => {
  res.status(200).json(fakeTodos);
});

app.get('/todos-delay', (req, res) => {
  setTimeout(() => res.status(200).json(fakeTodos), 2000);
});

app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (text) {
    const insertedTodo = {
      id: uuid(),
      createdAt: Date.now(),
      isCompleted: false,
      text
    };
    fakeTodos.push(insertedTodo);
    res.status(200).json(insertedTodo);
  } else {
    res.status(400).json({ message: 'Request body should have a text property.' });
  }
});

app.post('/todos/:id/completed', (req, res) => {
  const { id } = req.params;
  const matchingTodo = fakeTodos.find(todo => todo.id === id);
  const updateTodo = {
    ...matchingTodo,
    isCompleted: true
  };
  if (updateTodo) {
    fakeTodos = fakeTodos.map(todo => todo.id === id ? updateTodo : todo);
    res.status(200).json(updateTodo);
  } else {
    res.status(400).json({ message: 'There is no todo with that id.' });
  }
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const removedTodo = fakeTodos.find(todo => todo.id === id);
  fakeTodos = fakeTodos.filter(todo => todo.id !== id);
  res.status(200).json(removedTodo);
});

app.listen(8080, () => console.log('Server listening on port 8080'));
