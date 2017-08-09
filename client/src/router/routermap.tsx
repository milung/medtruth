
import * as React from 'react';
import { Route, Switch } from 'react-router';

import Gallery from '../components/gallery';
import InnerComponent from '../components/test';



export const RouteMap = () => (
    <div>
        <Switch>
            <Route path="/" exact component={Gallery}/>
            <Route path="/gallery/:uploadID/:study/:series" component={InnerComponent} />
        </Switch>
    </div>
);
