const http = require('http');
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://mongo:27017');

let db;

async function startServer() {
  await client.connect();
  db = client.db('taskdb');
  const collection = db.collection('tasks');

  const server = http.createServer(async (req, res) => {

    if (req.method === 'GET' && req.url === '/tasks') {
      const tasks = await collection.find().toArray();
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(tasks));
    }

    else if (req.method === 'POST' && req.url === '/tasks') {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        const task = JSON.parse(body);
        await collection.insertOne(task);
        res.end("Task added to DB");
      });
    }

    else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  });

  server.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

startServer();