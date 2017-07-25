
import * as express from 'express';
import { routes } from './routes';

// Set-up a server, with routes and static public files.
export const server = express();
server.use(express.static('public/'));
server.use(routes);

// Listen and serve.
const port = 8080;
server.listen(process.env.PORT || port, () => {
    console.log("Listening on port", port);
});
