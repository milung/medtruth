
import * as React from 'react';
import { Route, Switch, Router } from 'react-router';

import Gallery from '../components/gallery';
import InnerComponent from '../components/test';
import { StudyViewer } from "../imageview/StudyViewer";
import { SeriesViewer } from "../imageview/SeriesViewer";
import { ImageViewer } from "../imageview/ImageViewer";

export const RouteMap = () => (
    <div>
        <Switch>

            <Route path="/patients/:patientID" component={StudyViewer} />
            <Route path="/studies/:studyID/:patientID" component={SeriesViewer} />
            <Route path="/:seriesID/:patientID/:studyID" component={ImageViewer} />

            {/* <Route path="/:patientID" component={StudyViewer}/>
            <Route path="/:patientID/:studyID" component={SeriesViewer}/>
            <Route path="/:patientID/:studyID/:seriesID" component={InnerComponent}/> */}

            <Route path="/" exact component={Gallery} />
            {/* <Route path="/gallery/:uploadID/:study/:series" component={InnerComponent} />  */}

            {/* <Route path="/" exact > 
                <IndexRoute component={Gallery} /> 
                <Route path="/patients/:patientID" component={StudyViewer} >
                    <Route path="/patients/:patientID/studies/:studyID" component={SeriesViewer} />
                </Route>
            </Route> */}
        </Switch>
    </div>
);
