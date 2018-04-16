import React from 'react';
import Favicon from 'react-favicon';
import { Route } from 'react-router-dom';
import Chart from '../chart';

const App = () => (
    <div>
        <Favicon url={`../../public/favicon.ico`}/>
        <main>
            <Route exact path="/" component={Chart}/>
        </main>
    </div>
);

export default App;