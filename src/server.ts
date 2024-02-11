import { Controller as Users } from './controller/controller';
import { getReqData, uuidValidate } from './utils/utils';
import { IncomingMessage, ServerResponse } from 'http';
const SERVER_PORT = process.env.PORT;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    try {
      const users = await new Users().getUsers();
      res.setHeader('Process-id', process.pid);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
    } catch (error) {
      res.setHeader('Process-id', process.pid);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error on the server side' }));
    }
  } else if (req.url === '/api/users' && req.method === 'POST') {
    try {
      const usersData = await getReqData(req, res);
      if (!usersData.hobbies || !usersData.age || !usersData.username) {
        res.setHeader('Process-id', process.pid);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Request body does not contain required fields' }));
      } else {
        const user = await new Users().addUser(usersData);
        res.setHeader('Process-id', process.pid);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      }
    } catch (error) {
      res.setHeader('Process-id', process.pid);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error on the server side' }));
    }
  } else if (req.url?.match(/\/api\/users\/[\w-]+$/) && req.method === 'GET') {
    try {
      const id = req.url.split('/')[3];
      const userById = await new Users().getUserById(id);
      const validationResult = uuidValidate(id);
      if (!validationResult) {
        res.setHeader('Process-id', process.pid);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User id is invalid' }));
      } else if (!userById) {
        res.setHeader('Process-id', process.pid);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User was not found' }));
      } else {
        res.setHeader('Process-id', process.pid);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(userById));
      }
    } catch (error) {
      res.setHeader('Process-id', process.pid);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error on the server side' }));
    }
  } else if (req.url?.match(/\/api\/users\/[\w-]+$/) && req.method === 'PUT') {
    try {
      const id = req.url.split('/')[3];
      const usersData = await getReqData(req, res);
      const userById = await new Users().getUserById(id);
      const validationResult = uuidValidate(id);
      if (!validationResult) {
        res.setHeader('Process-id', process.pid);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User id is invalid' }));
      } else if (!userById) {
        res.setHeader('Process-id', process.pid);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User was not found' }));
      } else {
        if (!usersData.hobbies || !usersData.age || !usersData.username) {
          res.setHeader('Process-id', process.pid);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Request body does not contain required fields' }));
        } else {
          const newUser = {
            id: id,
            username: usersData.username,
            age: usersData.age,
            hobbies: usersData.hobbies,
          };
          const updatedUser = await new Users().updateUserById(newUser);
          res.setHeader('Process-id', process.pid);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedUser));
        }
      }
    } catch (error) {
      res.setHeader('Process-id', process.pid);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error on the server side' }));
    }
  } else if (req.url?.match(/\/api\/users\/[\w-]+$/) && req.method === 'DELETE') {
    try {
      const id = req.url.split('/')[3];
      const userById = await new Users().getUserById(id);
      const validationResult = uuidValidate(id);
      if (!validationResult) {
        res.setHeader('Process-id', process.pid);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User id is invalid' }));
      } else if (!userById) {
        res.setHeader('Process-id', process.pid);
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User was not found' }));
      } else {
        const userIndex = await new Users().getUserIndex(id);
        const result = await new Users().deleteUserById(userIndex);
        console.log(result);
        res.setHeader('Process-id', process.pid);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User deleted successfully!' }));
      }
    } catch (error) {
      res.setHeader('Process-id', process.pid);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Error on the server side' }));
    }
  } else {
    res.setHeader('Process-id', process.pid);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route was not found' }));
  }
});
server.listen(SERVER_PORT || 5000, () => {
  console.log(`Server started on port: ${SERVER_PORT}`);
});