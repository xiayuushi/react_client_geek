import axios from 'axios'
import { getToken } from '@/utils/storage'
import { message } from 'antd'
import store from '@/store'
import { logout } from '@/store/actions/login'
import history from '@/utils/history'

const instance = axios.create({
  baseURL: process.env.REACT_APP_URL,
})

instance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response.data.data
  },
  (error) => {
    if (error?.response?.status === 401) {
      console.log(history.location.state.from)
      message.error('登录信息过期')
      store.dispatch(logout())
      history.replace({
        to: '/login',
        state: {
          from: history.location.pathname,
        },
      })
    }
    return Promise.reject(error)
  }
)

export default instance

// 01、非组件中无法直接使用react-router-dom的history对象
// 02、非函数组件中无法使用hook，因此此处用户登录过期报错401时，必须使用store.dispatch()，而不能使用useDispatch
// 03、安装react-router-dom时，会自动携带安装一个history的包，因此可以通过它来做非组件中使用history对象实现登录跳转
// 04、history库使用的方式如下
// 04、st1 从history这个库中导入createBrowserHistory这个方法（不用额外安装history这个库，它随react-router-dom安装时已经一并安装了）
// 04、st2 将根组件App组件的导入的BrowserRouter改成导入Router（并非使用as对组件进行重命名，而是直接导Router组件）
// 04、st3 在配置一级路由中为不带history对象的Router组件自定义添加history对象
// 04、为了确保整个项目使用的是同一个history对象，建议将st2与st3封装为同一个对象，后续需要使用history对象时直接导入使用该对象即可

// N1、BrowserRouter或者HashRouter都是react-router-dom中特殊的带history对象的Router
// N2、react-router-dom还有一种原先不带history对象的Router（名称就是Router），它可以自己添加history属性传递history对象

// N3、即 BrowserRouter 等同于 Router + createBrowserHistory()
// N3、st1、import { Router } from 'react-router-dom';
// N3、st2、import { createBrowserRouter } from 'history';
// N3、st3、const history = createBrowserRouter()
// N3、st4、<Router history={history}>内部嵌套一级路由</Router>
// 为了确保是同一个history对象，应该将st2与st3封装为一个对象，后续在需要使用该对象的地方导入即可，
// 千万不要多次调用createBrowerRouter()生成history对象，否则不会是同一个对象

// N4、即 HashRouter 等同于 Router + createHashHistory()
// N4、流程与上面类似，只需要将导入方法由createBrowserRouter改为createHashHistoryRouter即可

// N5、将项目中原先从react-router-dom导入使用的BrowserRouter或者HashRouter改成无history对象的Router后，必须自己传入history对象，否则会报错
// N5、此处提到的改，指的并非是将BrowserRouter或者HashRouter的组件名通过as的方式改写成Router，而是指直接从react-router-dom中将导出不直接带history的Router组件

// N6、响应拦截器中也应该记录回跳地址（非组件中可以通过传递给Router的history属性的history对象拿到location.patnname）
// N6、响应拦截器在也应该将原先history.push()改成history.replace()

// N7、react-router-dom中路由跳转的两个方法history.push()与history.replace()的区别
// 1、history.push()会产生历史记录，即，将跳转到目标页面时，会把当前页所在路径加入历史记录，导致回跳时会经过当前页
// 2、history.replace()不会产生历史记录，是替换操作，即，将跳转到目标页面时，不会把当前页所在路径加入历史记录，常用于做登录回跳
// -、例如如下场景：当访问layout时登录信息过期被响应拦截器拦截到 login页重新登录时
// 1、使用history.push('/login') 则历史路径为 layout --> login --> layout，回退时会退到login页面
// 2、使用history.replace('/login') 则历史路径为 layout --> layout，回退时会退到layout页面
