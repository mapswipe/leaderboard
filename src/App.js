import React from 'react';
import { getUsersPromise } from './api/callApi';

function App() {
  getUsersPromise('dev').then(res => console.log(res));
  return (
    <div>
      <h1>Hello Wolrd</h1>
    </div>
  );
}

export default App;
