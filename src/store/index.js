import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { getToken } from '@/utils/storage'

let middlewares
process.env.NODE_ENV === 'development'
  ? (middlewares = composeWithDevTools(applyMiddleware(thunk)))
  : (middlewares = applyMiddleware(thunk))

const store = createStore(
  rootReducer,
  {
    login: {
      token: getToken(),
    },
  },
  middlewares
)

export default store

// redux的createStore()可以传入3个参数：
// 参数1 通常是合并后的根reducer
// 参数2 store读取的默认state状态，是一个可选值（整体是一个对象，对象的键是参数1根reducer下的模块，可以根据模块取到需要设置为默认读取状态）
// 参数3 需要使用到的redux中间件，是一个可选值（当不设置store读取的默认state状态时，中间件也可以作为第二参数）
// 如果需要读取默认状态，则参数2可以当成是参数1的解构，需要默认读取哪个reducer的状态，就解构出哪个reducer模块
// 默认读取的state是否设置成功，可以在浏览器redux选项卡的@@INIT中查看state

// N1、应根据环境变量来配置redux开发者工具
// --、上线后不再需要redux开发者工具查看状态，因此可以根据环境变量来配置上线后移除开发者工具的配置项
