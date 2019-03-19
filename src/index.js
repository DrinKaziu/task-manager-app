const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch(e) {
    res.status(400).send(e);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch(e) {
    res.send(500).send();
  }
});

app.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  
  try {
    const user = await User.findById(_id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch(e) {
    res.status(500).send();
  }
});

app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdates = ['name', 'age', 'email', 'password'];
  const isValidUpdate = updates.every((update) => validUpdates.includes(update));

  if(!isValidUpdate) return res.status(400).send({error: 'Please enter a valid item to update.'});

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).send();
    res.send(user);
  } catch(e) {
    res.status(400).send(e);
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send();
    res.send(user);
  } catch(e) {
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
});