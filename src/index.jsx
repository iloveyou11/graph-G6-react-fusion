import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

// 使用fusion组件库
import '@alifd/next/dist/next.css';

ReactDOM.render(
    <React.StrictMode >
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);