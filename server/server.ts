
import * as express from 'express';
import { routes } from './routes';
import { StatusCode } from './constants';

// Set-up a server, with routes and static public files.
export const server = express();

// Serve public files first.
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
