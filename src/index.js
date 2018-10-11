import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App.jsx';
import Welcome from './views/Welcome.jsx';
import ArticleManage from './views/article/ArticleManage/index.jsx';
import ArticleAdd from './views/article/ArticleAdd/index.jsx';
import ColumnManage from './views/article/ColumnManage/index.jsx';
import UserList from './views/user/UserList/index.jsx';
import UserAdd from './views/user/UserAdd/index.jsx';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Router>
    <App>
      <Switch>
        <Route path="/article/article-manage" component={ArticleManage} />
        <Route path="/article/article-add" component={ArticleAdd} />
        <Route path="/article/column-manage" component={ColumnManage} />
        <Route path="/user/user-add" component={UserAdd} />
        <Route path="/user/user-list" component={UserList} />
        <Route path="*" component={Welcome} />
      </Switch>
    </App>
  </Router>,
  document.getElementById('app')
);
registerServiceWorker();
