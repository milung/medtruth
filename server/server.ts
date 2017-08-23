
import * as express from 'express';
import * as socketio from 'socket.io';
import * as http from 'http';
import { routes } from './routes';
import { StatusCode } from './constants';
import { AzureDatabase } from "./azure-service";
import * as ios from 'socket.io-stream';
import * as fs from 'fs';

// Set-up a server, with routes and static public files.
export const server = express();
const httpserver = http.createServer(server);
const io = socketio(httpserver);

// Serve public files.
server.use(express.static('public/'));

// On connection, handle socket events.
io.on('connection', handleEvents);

// Socket routes.
function handleEvents(socket: SocketIO.Socket) {
    socket.on('message', (msg) => {
        console.log(msg);
    })

    socket.on('upload', () => {
           // Emit an ok, that we are ready to accept files.
           socket.emit('ok', {});
           
                   let index = 1;
                   // Event that receives stream data.
                   ios(socket).on('data', (stream) => {
                       // Pipe the stream to a temporary file.
                       stream.pipe(fs.createWriteStream('uploads/' + index.toString()))
                       // After the stream has been done, emit an 'ok' event.
                       .on('finish', () => {
                           socket.emit('ok', {});
                           index++;
                       });
                   });
           
                   // Event that disconnects the socket, after receiving an end event.
                   socket.on('end', () => {
                       socket.disconnect();
                   })
    });
}

// Serve routes.
server.use(routes);


// As a last resort, send a NotFound status.
server.use((req, res, next) => {
    res.status(StatusCode.NotFound)
        .json(
        {
            message: 'Route not found'
        }
        );
})

// Initialize database, listen and serve.
const port = 8000;

AzureDatabase.connect();

httpserver.listen(process.env.PORT || port, () => {
    console.log("Listening on port", port);
});
