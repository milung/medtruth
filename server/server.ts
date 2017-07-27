
import * as express from 'express';
import { routes } from './routes';
import { StatusCode } from './constants';
import { MongoClient } from 'mongodb';
import { url } from './constants';

export let db;

// Initialise connection to MongoDB.
MongoClient.connect(url, function (err, database) {
    if (err) throw err;
    db = database;
    console.log("Successfully connected to database!");
});

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

// Listen and serve.
const port = 8080;
server.listen(process.env.PORT || port, () => {
    console.log("Listening on port", port);
});
