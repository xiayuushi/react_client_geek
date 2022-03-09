import { lazy } from 'react'
import { Layout, Menu, Popconfirm, message } from 'antd'
import {
  LogoutOutlined,
  HomeOutlined,
  HddOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Switch, Route, Link, useLocation, useHistory } from 'react-router-dom'
import styles from './index.module.scss'

// import Home from '../Home'
// import Article from '../Article'
// import Publish from '../Publish'
const Home = lazy(() => import('../Home'))
const Article = lazy(() => import('../Article'))
const Publish = lazy(() => import('../Publish'))

import { user_getUserInfo } from '@/store/actions/user'
import { logout } from '@/store/actions/login'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const { Header, Sider } = Layout

const LayoutComponent = () => {
  let { pathname } = useLocation()
  // 解决编辑文章时菜单无高亮
  if (pathname.startsWith('/layout/publish')) {
    pathname = '/layout/publish'
  }
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state)
  useEffect(() => {
    dispatch(user_getUserInfo())
  }, [dispatch])

  const history = useHistory()
  const onConfirm = () => {
    dispatch(logout())
    history.push('/login')
    message.success('已退出', 1)
  }
  return (
    <div className={styles['root']}>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <div className="profile">
            <span>{user.name}</span>
            <Popconfirm
              title="是否退出登录?"
              onConfirm={onConfirm}
              okText="确定"
              cancelText="取消"
              placement="bottomRight"
            >
              <span>
                <LogoutOutlined></LogoutOutlined> 退出
              </span>
            </Popconfirm>
          </div>
        </Header>
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              theme="dark"
              selectedKeys={[pathname]}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="/layout" icon={<HomeOutlined />}>
                <Link to="/layout">数据概览</Link>
              </Menu.Item>
              <Menu.Item key="/layout/article" icon={<HddOutlined />}>
                <Link to="/layout/article">文章管理</Link>
              </Menu.Item>
              <Menu.Item key="/layout/publish" icon={<EditOutlined />}>
                <Link to="/layout/publish">发布文章</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '24px', overflow: 'auto' }}>
            <Switch>
              <Route exact path="/layout" component={Home} />
              <Route path="/layout/article" component={Article} />
              <Route
                exact
                path="/layout/publish"
                component={Publish}
                key="add"
              />
              <Route
                path="/layout/publish/:id"
                component={Publish}
                key="edit"
              />
            </Switch>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}

export default LayoutComponent

// 01、因为antd的组件已经处理好了点击高亮的效果，因此此处react-router-dom的链接跳转使用不带高亮效果的Link组件就够了（无需使用带高亮的NavLink）
// 02、点击某个侧边栏Link刷新后依旧第一个高亮，后续面包屑点击跳转时无法跟随高亮，这是受到Menu的defaultSelectedKeys影响，因此该属性不能写死，应该与路由的path路径一致
// 03、调整Menu.Item的key属性值与路由path一致，因为它与Menu的defaultSelectedKeys的值关联
// 04、Menu的defaultSelectedKeys只会在组件初始化时指向一次，因此无法满足动态切换的高亮需求，因此需要将该属性换成selectedKeys属性
// 05、添加文章与编辑文章共用一个组件，区别在于编辑文章需要在路径中携带参数，因此需要配置动态路由
// 06、为了区分添加文章与编辑文章的路由，必须对路径中不带id参数的添加文章路由设置exact精确匹配，而动态路由则不需要exact

// 07、Menu菜单高亮设置selectedKeys属性指向地址栏路径pathname，而Menu.Item设置key属性与组件的路由path保持一致，就能实现菜单高亮
// 08、编辑文章之所以无法实现菜单高亮，是因为动态路由path后携带id导致pathname（'/layout/publish/:id'）无法直接与'/layout/publish'进行匹配

// 09、当两个路径共用一个组件时，如果这两个pathname相互切换，可能无法让组件先进行销毁再重新渲染，这会导致意想不到的bug
// 09、因此为了让组件先销毁再重新渲染，可以为这两个路由指定不同的key属性，用于标识，这样子就可以强制其在切换时因不同而能够先销毁再重新渲染
