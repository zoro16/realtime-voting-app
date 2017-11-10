import React from 'react';
import ReactDOM from 'react-dom';
import './static/style/index.css';
import Main from './components/Main';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<Main />, document.getElementById('root'));
registerServiceWorker();
