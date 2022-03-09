import { lazy } from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import history from '@/utils/history'

// import Login from '@/pages/Login'
// import Layout from '@/pages/Layout'
// import NotFound from '@/pages/NotFound'

import AuthRoute from '@/components/AuthRoute'

const Login = lazy(() => import('@/pages/Login'))
const Layout = lazy(() => import('@/pages/Layout'))
const NotFound = lazy(() => import('@/pages/NotFound'))

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
          <AuthRoute path="/layout" component={Layout} />
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

// 项目打包优化
// 01、根据环境变量来配置redux开发者工具
// --、上线后不再需要redux开发者工具查看状态，因此可以根据环境变量来配置上线后移除开发者工具的配置项
// 02、路由懒加载（组件采用懒加载方式导入，利于首屏加载速度提升）
// --、提示：'Uncaught Error: A React component suspended while rendering, but no fallback UI was specified...'
// --、原因：路由懒加载不会立即加载，在加载前没有渲染内容会报错，因此需要使用suspense组件添加回调来加载渲染前的内容（通常是loading之类的过渡效果）
// --、解决：添加Suspense组件包裹整个根组件App或者根路由，并设置fallback属性返回渲染失败的结构，例如 <Suspense fallback={<div>加载中请稍后...</div>}><App /></Suspense>
