
import * as React from 'react';
import { Route, Switch, Router } from 'react-router';

import Gallery from '../components/gallery';
import InnerComponent from '../components/test';
import { StudyViewer } from '../imageview/StudyViewer';
import { SeriesViewer } from '../imageview/SeriesViewer';
import { ImageViewer } from '../imageview/ImageViewer';

export const RouteMap = () => (
    <div>
        <Switch>
            <Route path="/patients/:patientID" component={StudyViewer} />
            <Route path="/studies/:studyID/:patientID" component={SeriesViewer} />
            <Route path="/:seriesID/:patientID/:studyID" component={ImageViewer} />
            <Route path="/" exact={true} component={Gallery} />
        </Switch>
    </div>
);
