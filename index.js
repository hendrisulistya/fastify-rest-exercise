"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const server = (0, fastify_1.default)();
const database = [
    { id: 1, username: 'abdul', fullname: 'Abdul Mutholib', email: 'adul@mail.com' },
    { id: 2, username: 'budi', fullname: 'Budi Gunawan', email: 'budi@mail.com' },
    { id: 3, username: 'catur', fullname: 'Catur Hadi Wibowo', email: 'catur@mail.com' },
];
function generateID() {
    const lastItem = database.at(-1);
    return lastItem.id + 1;
}
server.get('/', async (request, reply) => {
    reply.send({ message: 'Welcome to the User database API!' });
});
server.get('/users/:name?', async (request, reply) => {
    const { name } = request.params;
    let result = database;
    if (name) {
        result = database.filter(user => user.fullname.toLowerCase().includes(name.toLowerCase()));
        if (!result.length) {
            reply.status(404).send({ error: "Spesific user not found" });
        }
    }
    reply.send(result);
});
server.get('/user/:id', async (request, reply) => {
    const selectUser = database.find(user => user.id === parseInt(request.params.id));
    if (!selectUser)
        reply.status(404).send({ error: 'User not found' });
    reply.send(selectUser);
});
server.post('/user', async (request, reply) => {
    const newUser = request.body;
    const duplicate = database.filter(i => i.id === newUser.id);
    if (duplicate.length > 0) {
        reply.status(400).send({ error: 'Duplicate ID' });
        return;
    }
    newUser.id = generateID();
    database.push(newUser);
    reply.send({ message: 'User added successfully' });
});
server.delete('/user/:id', async (request, reply) => {
    const id = request.params.id;
    const index = database.findIndex(user => user.id == id);
    if (index === -1) {
        reply.status(404).send({ error: 'User not found' });
        return;
    }
    database.splice(index, 1);
    reply.status(200).send({ message: 'User deleted successfully' });
});
server.put('/user/:id', async (request, reply) => {
    const id = request.params.id;
    const updatedUser = request.body;
    const userIndex = database.findIndex(user => user.id == id);
    if (userIndex === -1) {
        reply.status(404).send({ error: 'User not found' });
        return;
    }
    database[userIndex] = Object.assign(Object.assign({}, database[userIndex]), updatedUser);
    reply.status(200).send({ message: 'User updated successfully', data: database[userIndex] });
});
server.listen(8080, err => {
    if (err)
        throw err;
    console.log('Server listening on http://localhost:8080');
});
