import * as ios from 'socket.io-stream';
import { UploadFiles, FileStatus, UploadStatus } from "./controllers/uploadSocket";
import * as fs from 'fs';
import * as uuid from 'uuid/v1';
import { storagePath } from "./constants";
import * as _ from 'lodash';

// Socket routes.
export function handleEvents(socket: SocketIO.Socket) {
    socket.on('message', (msg) => {
        console.log(msg);
    })

    socket.on(':upload', () => {
        // Emit an ok, that we are ready to accept files.
        let uploadController = new UploadFiles();
        console.log('NEW UPLOAD CONTROLLER CREATED');
        
        socket.on('disconnect', () => {
            _.forEach(uploadController.getFilesTodelete(), (id) => {
                console.log('removed: ' + id);
                fs.unlink(storagePath + id, (err) => { });
                uploadController.decrementUploadCounter()
            });
            uploadController.setUploadTerminated();
            
        });

        socket.emit(':upload.ok', { transports: ['polling'] });
        

        // Event that receives stream data.
        ios(socket).on(':upload.data', (stream, json) => {
            
            uploadController.incrementUploadCounter();
            let id = uuid();
            let fileName: string = json.name;
            uploadController.getFilesTodelete().push(id);

            
            console.log("file started " + id);
            // Pipe the stream to a temporary file.
            stream.pipe(
                fs.createWriteStream(storagePath + id))
                // After the stream has been done, emit an 'ok' event.
                .on('finish', async () => {
                    // upload is ok
                    _.remove(uploadController.getFilesTodelete(), (item) => {
                        return item == id;
                    });
                    socket.emit(':upload.ok', {});
                    let status: FileStatus = await uploadController.handleFile(id);
                    let uploadStatus: UploadStatus = {fileName: fileName, id: id, fileStatus: status};
                    console.log(uploadStatus);
                    
                    socket.emit(':upload.completed', uploadStatus)

                })
                .on('error', () => {
                    console.log("ERROR pipe");
                    uploadController.decrementUploadCounter()
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