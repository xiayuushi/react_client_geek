import { useEffect, useRef } from 'react'
import {
  Card,
  Breadcrumb,
  Form,
  Radio,
  Select,
  DatePicker,
  Button,
  Table,
  Tag,
  Image,
  Space,
  Popconfirm,
  message,
} from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  getChannelsList,
  getArticlesData,
  delArticle,
} from '@/store/actions/article'
import noImg from '@/assets/error.png'

const STATUS = [
  { value: -1, name: '全部', color: '#fff' },
  { value: 0, name: '草稿', color: '#666' },
  { value: 1, name: '待审核', color: '#ccc' },
  { value: 2, name: '审核通过', color: '#080' },
  { value: 3, name: '审核失败', color: '#f00' },
]
const Article = () => {
  const history = useHistory()
  const paramsRef = useRef({})
  const dispatch = useDispatch()
  const { article } = useSelector((state) => state)

  useEffect(() => {
    dispatch(getChannelsList())
    dispatch(getArticlesData())
  }, [dispatch])

  const onFinish = (values) => {
    const { status, date, channel_id } = values
    status === -1
      ? delete paramsRef.current.status
      : (paramsRef.current.status = status)
    if (date) {
      paramsRef.current.begin_pubdate = date[0]
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
      paramsRef.current.end_pubdate = date[1]
        .endOf('day')
        .format('YYYY-MM-DD HH:mm:ss')
    } else {
      delete paramsRef.current.begin_pubdate
      delete paramsRef.current.end_pubdate
    }
    paramsRef.current.channel_id = channel_id

    paramsRef.current.page = 1
    dispatch(getArticlesData(paramsRef.current))
  }

  const delCurrentArticle = async (id) => {
    await dispatch(delArticle(id))
    await dispatch(getArticlesData(paramsRef.current))
    message.success('文章删除成功')
  }

  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      render: (cover) => {
        if (cover.type === 0) {
          return <Image width={200} height={150} src={noImg} fallback={noImg} />
        }
        return (
          <Image
            width={200}
            height={150}
            src={cover.images[0]}
            fallback={noImg}
          />
        )
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => {
        const item = STATUS.find((item) => item.value === status)
        return <Tag color={item.color}>{item.name}</Tag>
      },
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id) => {
        return (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => history.push(`/layout/publish/${id}`)}
            ></Button>
            <Popconfirm
              title="是否删除当前文章?"
              onConfirm={() => delCurrentArticle(id)}
              okText="删除"
              cancelText="取消"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  return (
    <div>
      <Card
        title={
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/layout">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>当前页</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form initialValues={{ status: -1 }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              {STATUS.map((item) => (
                <Radio value={item.value} key={item.value}>
                  {item.name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="频道" name="channel_id">
            <Select allowClear placeholder="请选择频道" style={{ width: 120 }}>
              {article.channels.map((item) => (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="日期" name="date">
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item label="筛选">
            <Button type="primary" htmlType="submit">
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card
        title={`根据筛选条件共查询到${article.articles.total_count}条结果:`}
        style={{ marginTop: 10 }}
      >
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={article.articles.results}
          size="middle"
          pagination={{
            position: ['bottomRight'],
            current: article.articles.page,
            pageSize: article.articles.per_page,
            total: article.articles.total_count,
            onChange: (page, pageSize) => {
              pageSize !== article.articles.per_page
                ? (paramsRef.current.page = 1)
                : (paramsRef.current.page = page)
              paramsRef.current.per_page = pageSize
              dispatch(getArticlesData(paramsRef.current))
            },
          }}
        />
      </Card>
    </div>
  )
}

export default Article

// 01、antd的Button设置htmlType='submit'可以配合antd的Form组件onFinish事件进行提交表单（Form.Item必须设置name，name值应该与接口文档的字段名保持一致）
// 02、使用antd的Form表单（onFinish）+Button组件（htmlType='submit'），非自定义组件则无需进行受控，自定义组件则只需嵌套于Form.Item内自动会有value与onChange属性（也无需手动受控）
// 03、上面表单筛选状态与下方表格的状态应该相互关联，因此应该定义一份数据STATUS让两者协同，上面表单Radio状态与下方表格columns.status中render函数的关联起来
// 04、useState()生成的state其实就处于闭包环境中，因此组件渲染时上一次的闭包及对应的状态在闭包调用完毕后会被回收且生成新的闭包
// 04、useState()生成的状态因闭包的存在每次都在各自闭包环境中存在，涉及异步时不能确保 是同一个阶段的state

// 05、如何确保闭包中的状态是同一个？
// 05、方法1 在组件外定义全局变量，将各自闭包中的值与其关联（弊端：在组件外部创建，容易被篡改且如果同一文件不同组件都使用该数据会相互影响）
// 05、方法1 使用useRef()生成的对象来贯穿组件中的所有闭包，并将各自闭包中的值与useRef()生成的对象的current属性关联

// 06、useRef()生成的对象是不会随组件渲染而改变的，且它是贯穿组件所有闭包存在的，但它的current属性是可变的
// 06、useRef()生成的对象会贯穿组件内的闭包，不会受组件重新渲染而改变，这个hook生成的对象是不会变的，该特性对于在同一组件中会很有用

// 07、const [xxx, setXxx]=useState({}) //xxx是组件闭包中的值（闭包外部环境不可将其改变）
// 07、const ref =useRef({}) //ref是贯穿于整个组件且不变的对象（但ref.current可以改变，因此通过ref.currnet突破闭包限制获取最新状态的值）

// 08、useRef()生成的对象是函数组件中通用的，可以突破闭包限制，但它的current属性可变
// 08、基于以上两点，因此可以在组件内通过该hook创建对象
// 08、useRef()生成的对象确保在组件内任意地方可以访问（该对象整体不变，贯穿与组件，图片闭包限制）
// 08、在组件内不同闭包中对其current属性赋值（该对象current属性可变则可在异步中也能获取最新值）
