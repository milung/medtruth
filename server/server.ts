
import * as express from 'express';
import { routes } from './routes';
import { StatusCode } from './constants';
import { AzureDatabase } from "./azure-service";

// Set-up a server, with routes and static public files.
export const server = express();

// Serve public files.
server.use(express.static('public/'));

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
const port = 8080;

AzureDatabase.initialize().then(() => {
    server.listen(process.env.PORT || port, () => {
        console.log("Listening on port", port);
    });
    console.log("viva la continuous integration");

}, () => {
    console.log("Error when initializing database.");
});

