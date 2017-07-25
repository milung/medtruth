
import * as express from 'express';
import * as request from 'supertest';

import { routes } from './routes';
import { StatusCode } from './constants';

// <Server> tests.
describe('<Server>', () => {
    // Setup a test server with the original routes.
    const server = express();
    server.use(express.static('public/'));
    server.use(routes);
    const req = request(server)

    it('should serve', () => {
        return req.get('/')
            .expect(StatusCode.OK);
    });

    it('send NotFound status for unknown route', () => {
        return req.get('/unknown/route')
            .expect(StatusCode.NotFound);
    })

    // <API> tests.
    describe('<API>', () => {
        it('api should return options', () => {
            return req.options('/api')
                .expect(StatusCode.OK);
        });

        // <Uploads> tests.
        describe('<Uploads>', () => {
            it('uploads should return options', () => {
                return req.options('/api/_upload')
                    .expect(StatusCode.OK);
            });
        });

        // <Images> tests.
        describe('<Images>', () => {
            it('images should return options', () => {
                return req.options('/api/_images')
                    .expect(StatusCode.OK);
            });
        });
    });
});
