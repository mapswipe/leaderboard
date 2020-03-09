import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Board from './components/Board';

const App = () => (
  <BrowserRouter>
    <Switch>

      {/* v1 page */}
      <Route path="/v1" exact>
        <Board isV1 />
      </Route>

      {/* v2 page */}
      <Route path="/" exact>
        <Board />
      </Route>

      {/* 404 page */}
      <Route path="*">
        <Board />
      </Route>

    </Switch>
  </BrowserRouter>
);

export default App;
