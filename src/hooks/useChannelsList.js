import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getChannelsList } from '@/store/actions/article'

const useChannelsList = () => {
  const { article } = useSelector((state) => state)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getChannelsList())
  }, [dispatch])
  return article.channels
}

export default useChannelsList

// 01、此处封装的自定义hooks是为了复用redux中article模块的channels频道数据
// 02、函数组件中可以封装自定义hooks来实现数据逻辑复用
// 03、封装的自定义hooks只是逻辑数据上的复用，如果连同UI组件也要复用，则可以考虑组件封装
