const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const socketUtils = require('./utils/socketUtils');
const dyDb = require('./utils/dynamoDbUtils');

dotenv.config({
  path: './config.env',
});

const app = express();
const server = http.createServer(app);
const io = socketUtils.sio(server);
socketUtils.connection(io);

// CORS
app.use(cors());

// ROUTES
app.use('/api/v1/update', async (req, res) => {
  await dyDb.uptateItem('test-socket-io');
  const tableData = await dyDb.scanTable('test-socket-io');
  const formattedData = dyDb.formatTableData(tableData);
  console.log('formattedData after update', formattedData);
  io.emit('updatedData', formattedData);
  res.send('Record Updated');
});

// LISTEN
const port = process.env.PORT || 8000;
server.listen(port, async () => {
  console.log(`App running on port ${port}...`);
});

async function main() {
  const tableData = await dyDb.scanTable('test-socket-io');
  const formattedData = dyDb.formatTableData(tableData);
  io.on('connection', (socket) => {
    io.emit('initalData', formattedData);
  });
}
main();
