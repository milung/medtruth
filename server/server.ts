
import * as express from 'express';
import * as socketio from 'socket.io';
import * as http from 'http';
import { routes } from './routes';
import { StatusCode, storagePath } from './constants';
import { AzureDatabase } from "./azure-service";
import * as ios from 'socket.io-stream';
import * as fs from 'fs';
import * as uuid from 'uuid/v1';
import { Controller, UploadFiles } from "./controllers/uploadSocket";

var path = require('path');

// Set-up a server, with routes and static public files.
export const server = express();

const httpserver = http.createServer(server);
const io = socketio(httpserver, { transports: ['websocket'] });

// Serve public files.
server.use(express.static('public/'));


// On connection, handle socket events.
io.on('connection', handleEvents);

// Socket routes.
function handleEvents(socket: SocketIO.Socket) {
    socket.on('message', (msg) => {
        console.log(msg);
    })

    socket.on(':upload', () => {
        // Emit an ok, that we are ready to accept files.
        socket.emit(':upload.ok', {transports: ['websocket','polling']});
        let uploadController = new UploadFiles();

        // Event that receives stream data.
        ios(socket).on(':upload.data', (stream) => {
            // Pipe the stream to a temporary file.
            let id = uuid();
            stream.pipe(fs.createWriteStream(storagePath + id))
                // After the stream has been done, emit an 'ok' event.
                .on('finish', () => {
                    socket.emit(':upload.ok', {});
                    uploadController.handleFile(id);
                });
        });

        // Event that disconnects the socket, after receiving an end event.
        socket.on(':upload.end', () => {
            console.log("disconnecting socket");
            uploadController.finish();
            socket.disconnect();
        })
    });
}

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
