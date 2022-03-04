import { useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Card,
  Breadcrumb,
  Form,
  Input,
  Button,
  Space,
  Radio,
  Upload,
  Modal,
  Image,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

import ChannelSelect from '@/components/ChannelSelect'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { addArticle } from '@/store/actions/article'

const Publish = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const add = async ({ draft, values }) => {
    const images = fileList.map((item) => {
      if (item.url) {
        // 原先已存在图片路径（说明此时是编辑操作，则无需从服务器取）
        return item.url
      }
      // 不存在图片url（说明此时是添加操作）
      return item.response.data.url
    })
    const data = {
      ...values,
      cover: {
        type: values.type,
        images,
      },
    }
    await dispatch(addArticle({ draft, data }))
  }

  const onFinish = async (values) => {
    add({ values })
    history.replace('/layout/article')
  }

  const Draft = async () => {
    const values = await formRef.current.getFieldsValue()
    add({ values, draft: true })
    history.replace('/layout/article')
  }

  const [fileList, setFileList] = useState([])
  const fileRef = useRef(fileList)
  const [type, setType] = useState(1)
  const onTypeChange = (e) => {
    setType(e.target.value)
    // 因为在react的useState()中，状态type是异步的，
    // 它发生变化时可能无法及时触发变更，因此必须使用与它对应的此处的e.target.value作为数组slice截取长度的依据
    // Array.prototype.slice(起始下标， 截取长度)； 改方法不会修改源数组
    const sliceLength = e.target.value
    setFileList(fileRef.current.slice(0, sliceLength))
  }

  const formRef = useRef(null)
  const onUploadChange = ({ fileList }) => {
    setFileList(fileList)
    fileRef.current = fileList
    formRef.current.validateFields(['type', 'title', 'channel_id', 'content'])
  }

  const [preview, setPreview] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const onPreview = (file) => {
    setPreview(file.url ? file.url : file.response.data.url)
    setModalVisible(true)
  }

  return (
    <div className={styles['root']}>
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
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
          initialValues={{
            content: '',
            type: type,
          }}
          validateTrigger={['onChange', 'onBlur']}
          ref={formRef}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[
              {
                required: true,
                message: '标题不能为空',
              },
            ]}
          >
            <Input placeholder="请输入文章标题"></Input>
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[
              {
                required: true,
                message: '频道不能为空',
              },
            ]}
          >
            <ChannelSelect></ChannelSelect>
          </Form.Item>
          <Form.Item
            label="封面"
            name="type"
            rules={[
              {
                validator: (rule, value) => {
                  if (fileList.length !== value) {
                    return Promise.reject(new Error(`请上传${value}张图片`))
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Radio.Group value={type} onChange={onTypeChange}>
              <Radio value={1}>单图</Radio>
              <Radio value={3}>三图</Radio>
              <Radio value={0}>无图</Radio>
            </Radio.Group>
          </Form.Item>
          {type > 0 && (
            <Form.Item wrapperCol={{ offset: 4 }}>
              <Upload
                action={process.env.REACT_APP_URL + '/v1_0/upload'}
                listType="picture-card"
                fileList={fileList}
                onChange={onUploadChange}
                name="image"
                maxCount={type}
                onPreview={onPreview}
              >
                {fileList.length < type && <PlusOutlined />}
              </Upload>
            </Form.Item>
          )}
          <Form.Item
            label="内容"
            name="content"
            rules={[
              {
                required: true,
                message: '内容不能为空',
              },
            ]}
          >
            <ReactQuill></ReactQuill>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                发布文章
              </Button>
              <Button onClick={Draft}>存入草稿</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        title="图片预览"
        width={800}
        bodyStyle={{ textAlign: 'center' }}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Image width={600} src={preview} />
      </Modal>
    </div>
  )
}

export default Publish

// 01、antd的Form组件支持自定义表单，且提供了value与onchange属性对自定义表单进行受控
// 01、只需要让自定义组件嵌套于Form.Item内即可，在自定义组件内console.log(props)可看到antd的Form组件提供给自定义组件的value与onChange
// 02、<ChannelSelect></ChannelSelect>后续在自定义组件内部使用props进行接收（无需在当前父组件中设置，即可在自定义组件内props接收到value与onChange）
// 03、在自定义组件内部可以先在组件的props接收 后续通过属性解构的方式将所有接收到的props传递给组件各个属性
// 03、例如：const XxxCom =({value, onChange})=> ( <Xxx value={value} onChange={onChange}></Xxx> )
// 03、解构写法：const XxxCom =(props)=> ( <Xxx {...props}></Xxx> )

// react-quill富文本编辑器
// st1、安装 npm install react-quill --save
// st2、再需要使用的组件内引入react-quill及其样式 import ReactQuill from 'react-quill'; import 'react-quill/dist/quill.snow.css';
// st3、以组件的方式使用react-quill，例如 <ReactQuill theme="snow" value={value} onChange={setValue}/>
// N01、使用嵌套在antd的Form.Item组件内，无需像st3那样自己提供value及onChange属性（因为antd的Form组件自动会提供）
// N02、如果报错'Uncaught Error: You are passing the `delta` object from the `onChange` event back as `value`....'
// N02、报错原因：quill组件必须要有value属性（但与antd的Form组件配合使用时，quill组件会被Form.Item包裹，而Form会默认提供value属性以及onChange给quill组件）
// N02、因此无需为quill组件手动设置value属性进行受控，但为了解决该报错，就必须在Form组件上设置initValues属性配置quill的value属性对应的字段）
// N02、解决报错：在antd的Form组件设置initialValues属性控制对应react-quill组件所在的Form.Item组件的name属性对应的字段（字段名要与接口文档保持一致）
// N02、例如：<Form initialValues={{xxx: ''}}><Form.Item name="xxx"><ReactQuill></ReactQuill></Form.Item></Form>

// 关于antd的Form组件
// 01、它能够通过Form.Item指定name属性收集表单类的数据，只需要使用Form.Item包裹表单，并在Form.Item上设置name属性对应接口文档字段
// 02、被Form.Item包裹的表单无需手动受控，只需要在Form.Item上设置name属性对应接口文档字段即可
// 03、Form设置onFinish属性（事件），通过函数参数可以获取收集的数据（必须为按钮控件Button设置htmlType="submit"）
// 04、它只能收集表单类数据，对于文件上传之类的数据，还是需要通过useState()的方式自己手动受控去获取数据（例如此处的图片上传）
// 05、对于原先就有value属性及onChange属性的元素（例如表单），配合antd的Form组件使用，无需手动受控，因为antd的Form组件默认提供这两个属性
// 05、对于不靠value属性及onChange属性的元素获取数据的元素（例如文件上传），配合antd的Form组件使用，则必须手动受控拿到数据
// 06、如果需要根据需求自己手动受控，则可以去掉Form.Item组件上的name属性，然后给表单自己设置value与onChange（例如此处的Radio.Group与Radio）
// 07、validateFields(['type'])是Form组件实例的rule验证方法，因此需要通过ref属性获取Form的实例，
// 07、validateFields(['验证字段'])然后需要将验证的Form.Item的name属性值字段放进数组中，就会在事件中触发该字段的验证规则
// 08、getFieldsValue()不传参可以获取验证字段的返回值，返回值就是各个字段的值，该返回值可以用于接口传参
// 09、antd的Form组件的规则验证触发：
// 09、方式1、通过Button按钮设置htmlType="submit"是在点击提交按钮时触发的全局验证
// 09、方式2、通过事件内手动调用Form组件的validateFields(['验证字段'])方法进行验证，可以根据传入的验证字段进行相应的触发验证

// 关于antd的Upload组件（文件上传）
// 01、必须设置action属性，该属性用于设置上传的地址（非axios发请求地址，因此必须写全写完整的上传地址）
// 02、设置listType指定上传的数量，listType="picture-card"表示可上传多张图片
// 03、该组件必须手动受控（antd的Form组件只能对默认带有value属性与onChange属性的元素如表单免于受控）
// 04、文件上传回显必须将上传文件的url设置给受控数据fileList的url
// 05、默认情况下文件上传name属性指定为file，但是如果接口文档指定的是其他字段xxx，则必须设置name='xxx'，否则上传会报500错误

// useRef()返回的对象是不会发生变化的，但它的current属性是可变的
// 因此，可以用该hooks突破组件闭包限制，在同一组件中确保修改的是同一个数据
