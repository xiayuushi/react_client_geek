import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getChannelsList } from '@/store/actions/article'
import { Select } from 'antd'

const ChannelSelect = ({ value, onChange }) => {
  const { article } = useSelector((state) => state)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getChannelsList())
  }, [dispatch])
  return (
    <Select
      value={value}
      onChange={onChange}
      allowClear
      placeholder="请选择频道"
      style={{ width: 120 }}
    >
      {article.channels.map((item) => (
        <Select.Option placeholder="请选择频道" value={item.id} key={item.id}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  )
}

export default ChannelSelect

// 01、此处封装的是频道选择组件，即数据逻辑与组件都要通用的组件封装
// 02、封装的自定义hooks只是逻辑数据上的复用，如果连同UI组件也要复用，则应该使用组件封装

// 03、antd的Form组件支持自定义表单，且提供了value与onchange属性对自定义表单进行受控
// 03、只需要让自定义组件嵌套于Form.Item内即可，在自定义组件内console.log(props)即可看到antd的Form组件提供给自定义组件的value与onChange
// 04、<ChannelSelect></ChannelSelect>后续在自定义组件内部使用props进行接收（无需在当前父组件中设置，即可在自定义组件内props接收到value与onChange）
// 05、在自定义组件内部可以先在组件的props接收 后续通过属性解构的方式将所有接收到的props传递给组件各个属性
// 04、例如：const XxxCom =({value, onChange})=> ( <Xxx value={value} onChange={onChange}></Xxx> )
// 05、解构写法：const XxxCom =(props)=> ( <Xxx {...props}></Xxx> )
