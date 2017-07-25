
import * as express from 'express';
import * as request from 'supertest';

import { routes } from './routes';
import { StatusCode } from './constants';

describe('<Server>', () => {
    // Set-up a server, with routes and static public files.
    const server = express();
    server.use(express.static('public/'));
    server.use(routes);

    it('should be online', () => {
        return request(server)
            .get('/')
            .expect(StatusCode.OK);
    });

    describe('<API>', () => {
        it('api should return options', () => {
            return request(server)
                .options('/api')
                .expect(StatusCode.OK);
        });

        describe('<Uploads>', () => {
            it('uploads should return options', () => {
                return request(server)
                    .options('/api/_upload')
                    .expect(StatusCode.OK);
            });
        });

        describe('<Images>', () => {
            it('images should return options', () => {
                return request(server)
                    .options('/api/_images')
                    .expect(StatusCode.OK);
            });
        });
    });
});
