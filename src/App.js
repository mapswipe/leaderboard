import React from 'react';
import { getUsersPromise } from './lib/callApi';

function App() {
  getUsersPromise().then(res => console.log(res));
  return (
    <div>
      <h1>Hello Wolrd</h1>
    </div>
  );
}

export default App;
