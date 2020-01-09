import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Board from './components/Board';

const App = () => (
  <BrowserRouter>
    <Switch>

      {/* Home page */}
      <Route path="/">
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
