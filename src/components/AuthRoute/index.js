import { isLogin } from '@/utils/storage'
import { Route, Redirect, useLocation } from 'react-router-dom'

const AuthRouter = ({ component: Component, children, ...rest }) => {
  const location = useLocation()
  return (
    <Route
      {...rest}
      render={() => {
        if (isLogin()) return children ? children : <Component></Component>

        return (
          <Redirect
            to={{ pathname: '/login', state: { from: location.pathname } }}
          />
        )
      }}
    >
      {children}
    </Route>
  )
}

export default AuthRouter

// 01、自定义封装AuthRouter鉴权路由，限制某个页面只能在登录后访问（之所以自定义封装，是因为react中没有类似于vue那样的导航守卫）
// 02、const Xxx =(props)=><div {...props}></div> 表示接收所有传进来的属性
// 02、const Xxx =({xxx, ...rest})=><div {...rest}></div> 表示接收除了xxx之外的剩余属性
// 03、...rest是ES6剩余参数的写法，即所有参数中除了直接写明的，其他任何可能传入的参数
// 04、location.pathname可以记录跳转到目标页面之前的目标路由路径
// 04、为在登录页使用history.replace()回跳到之前页做准备（必须在登录页n中进行逻辑判断，有回跳地址就进行回跳否则跳'/layout'）
// 05、响应拦截器中也应该记录回跳地址（非组件中可以通过传递给Router的history属性的history对象拿到location.patnname）
// 05、响应拦截器在也应该将原先history.push()改成history.replace()

// N1、Route组件常见的三种指向渲染页面的用法，此处封装的鉴权路由以下三种都可以使用（配置path='*'或者不配置path即指向404页面）
// 01、通过component属性指向导入进来的渲染组件，即<Route path='/xxx' component={Xxx} />
// 02、通过render属性定义函数指向渲染组件，即<Route path='/xxx' render={()=><Xxx />} />
// 03、通过children属性指向渲染组件，即<Route path='/xxx'><Xxx /></Route>
// --、通常封装路由的时候会采用render属性定义函数指向渲染组件，因为函数中可以写逻辑处理

// N2、const history = useHistory() 或者 从prop.history中获取react-router-dom的history对象
// N2、history.push('/xxx') 等同于 history.push({ pathname:'/xxx', state:额外可以携带参数 })
// N2、同理，Redirect组件的to属性指向路径时也可以书写成对象形式方便携带参数（使用state字段携带参数，后续在目标页面可以通过props.location.state获取这些携带的参数）

// N3、此处封装之所以需要将component重新命名为首字母大写的Component是因为react组件必须大写开头
// N4、如果对一级路由中的某个路由使用鉴权路由，则该鉴权路由下的子路由则无需再使用鉴权路由（因为父级被拦截了，子级也跳转不过去）
// N4、即 <AuthRoute path='/layout' component={Layout} /> 则后续匹配子级路由/layout/xxx则使用正常的Route组件配置路由即可，无需使用鉴权路由
// N5、封装过程参考react-router-dom官网 https://v5.reactrouter.com/web/example/auth-workflow
