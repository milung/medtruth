
import * as express from 'express';
import * as socketio from 'socket.io';
import * as http from 'http';
import { routes } from './routes';
import { StatusCode, storagePath } from './constants';
import { AzureDatabase } from "./azure-service";
import { Controller, UploadFiles } from "./controllers/uploadSocket";
import { handleEvents } from "./websockets";

var path = require('path');

// Set-up a server, with routes and static public files.
export const server = express();

const httpserver = http.createServer(server);
const io = socketio(httpserver, { transports: ['polling'] });

// Serve public files.
server.use(express.static('public/'));


// On connection, handle socket events.
io.on('connection', handleEvents);

// Serve routes.
server.use(routes);

// As a last resort, send a NotFound status.
// server.use((req, res, next) => {   
//     console.log("window.history.state: ", history.state); 
//     res.status(StatusCode.NotFound)
//         .json(
//         {
//             message: 'Route not found',
//         }        
//         );
// })

server.get('*', async function (req, res) {
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

// Initialize database, listen and serve.
const port = process.env.PORT || 8080;

AzureDatabase.connect();

httpserver.listen(port, () => {
    console.log("Listening on port", port);
});
console.log("viva la continuous integration");
