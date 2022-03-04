import { Layout, Menu, Popconfirm, message } from 'antd'
import {
  LogoutOutlined,
  HomeOutlined,
  HddOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { Switch, Route, Link, useLocation, useHistory } from 'react-router-dom'
import styles from './index.module.scss'
import Home from '../Home'
import Article from '../Article'
import Publish from '../Publish'
import { user_getUserInfo } from '@/store/actions/user'
import { logout } from '@/store/actions/login'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const { Header, Sider } = Layout

const LayoutComponent = () => {
  const { pathname } = useLocation()

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
              <Route path="/layout/publish" component={Publish} />
            </Switch>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}

export default LayoutComponent

// 1、因为antd的组件已经处理好了点击高亮的效果，因此此处react-router-dom的链接跳转使用不带高亮效果的Link组件就够了（无需使用带高亮的NavLink）
// 2、点击某个侧边栏Link刷新后依旧第一个高亮，后续面包屑点击跳转时无法跟随高亮，这是受到Menu的defaultSelectedKeys影响，因此该属性不能写死，应该与路由的path路径一致
// 3、调整Menu.Item的key属性值与路由path一致，因为它与Menu的defaultSelectedKeys的值关联
// 4、Menu的defaultSelectedKeys只会在组件初始化时指向一次，因此无法满足动态切换的需求，因此需要将该属性换成selectedKeys属性
