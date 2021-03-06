import { Suspense } from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import './index.scss'
import App from './App'

import store from './store'
import { Provider } from 'react-redux'

import { ConfigProvider } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/lib/locale/zh_CN'

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={locale}>
      <Suspense fallback={<div>加载中...</div>}>
        <App />
      </Suspense>
    </ConfigProvider>
  </Provider>,
  document.getElementById('root')
)
