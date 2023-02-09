import fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";

const server = fastify<Server,IncomingMessage, ServerResponse>();

interface User {
  id: Number,
  username: string,
  fullname: string,
  email: string,
}

const database:User[] = [
  { id: 1, username: 'abdul', fullname: 'Abdul Mutholib', email: 'adul@mail.com' },
  { id: 2, username: 'budi', fullname: 'Budi Gunawan', email: 'budi@mail.com' },
  { id: 3, username: 'catur', fullname: 'Catur Hadi Wibowo', email: 'catur@mail.com' },
];


function generateID(){
  const lastItem: any = database.at(-1);
  return lastItem.id +1
}

server.get('/', async (request, reply) => {
  reply.send({ message: 'Welcome to the User database API!' });
});

server.get('/users/:name?', async (request, reply) => {
  const { name }: any = request.params;
  let result = database;
  if (name) {
    result = database.filter(user => user.fullname.toLowerCase().includes(name.toLowerCase()));
    if(!result.length){
      reply.status(404).send({error : "Spesific user not found"})
    }
  }

  reply.send(result);
});

server.get('/user/:id', async (request:any , reply) => {
  const selectUser = database.find(user => user.id === parseInt(request.params.id));
  if (!selectUser) reply.status(404).send({ error: 'User not found' });
  reply.send(selectUser);
});

server.post('/user', async (request, reply) => {
  const newUser: any = request.body;
  const duplicate = database.filter(i => i.id === newUser.id)  
  if (duplicate.length > 0) {
    reply.status(400).send({ error: 'Duplicate ID' });
    return;
  }
  newUser.id = generateID();
  database.push(newUser);
  reply.send({ message: 'User added successfully' });
});


server.delete('/user/:id', async (request: any, reply) => {
  const id = request.params.id;

  const index = database.findIndex(user => user.id == id);
  if (index === -1) {
    reply.status(404).send({ error: 'User not found' });
    return;
  }

  database.splice(index, 1);
  reply.status(200).send({ message: 'User deleted successfully' });
});

server.put('/user/:id', async (request: any, reply) => {
  const id = request.params.id;
  const updatedUser = request.body;

  const userIndex = database.findIndex(user => user.id == id);
  if (userIndex === -1) {
    reply.status(404).send({ error: 'User not found' });
    return;
  }

  database[userIndex] = { ...database[userIndex], ...updatedUser };
  reply.status(200).send({ message: 'User updated successfully', data: database[userIndex] });
});

server.listen(8080, err => {
  if (err) throw err;
  console.log('Server listening on http://localhost:8080');
});
