import { Router, Switch, Route, Redirect } from 'react-router-dom'
import history from '@/utils/history'

import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import NotFound from '@/pages/NotFound'

const App = () => {
  return (
    <Router history={history}>
      <div className="app">
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/layout"></Redirect>}
          />
          <Route path="/login" component={Login} />
          <Route path="/layout" component={Layout} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  )
}

export default App

// 01、<Route path="/" exact render={()=><Redirect></Redirect>} />等同于<Redirect exact from="/" to="/layout"></Redirect>

// N1、BrowserRouter或者HashRouter都是react-router-dom中特殊的自带history对象的Router
// N2、react-router-dom还有一种原先不带history对象的Router组件（名称就是Router），它可以自己添加history属性传递history对象

// N3、即 BrowserRouter 等同于 Router + createBrowserHistory()
// N3、st1、import { Router } from 'react-router-dom';
// N3、st2、import { createBrowserRouter } from 'history';
// N3、st3、const history = createBrowserRouter()
// N3、st4、<Router history={history}>内部嵌套一级路由</Router>
// 为了确保整个项目使用的是同一个history对象，必须将history封装，后续在使用的地方直接导入该封装对象使用即可

// N5、使用不带history对象的Router组件，而不是自带history对象的BrowserRouter或者HashRouter，是为了在非组件中使用history对象进行路由跳转
// N6、非组件中使用history对象，必须使用Router组件，自己手动传递history对象
