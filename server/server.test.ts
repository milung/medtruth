
import * as express from 'express';
import * as request from 'supertest';
import * as azure from 'azure-storage';

import { AzureStorage } from './azure-service';
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

    it('NotFound status for unknown route', () => {
        return req.get('/unknown/route')
            .expect(StatusCode.NotFound);
    })

    // <API> tests.
    describe('<API>', () => {
        it('/api respond to OPTIONS', () => {
            return req.options('/api')
                .expect(StatusCode.OK);
        });

        // <Uploads> tests.
        describe('<Upload>', () => {
            it('/upload respond to OPTIONS', () => {
                return req.options('/api/upload')
                    .expect(StatusCode.OK);
            });
        });

        // <Images> tests.
        describe('<Images>', () => {
            it('/images        respond to OPTIONS', () => {
                return req.options('/api/images')
                    .expect(StatusCode.OK);
            });

            it('/images/:id    NotFound status with invalid id', () => {
                return req.get('/api/images/34298148941')
                    .expect(StatusCode.NotFound);
            })
        });
    });
});
