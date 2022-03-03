import { useState, useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'

const NotFound = () => {
  const [second, setSecond] = useState(5)
  const history = useHistory()
  const ref = useRef(second)

  useEffect(() => {
    let timeID = setInterval(() => {
      setSecond(ref.current - 1)
      if (ref.current <= 1) {
        clearInterval(timeID)
        history.push('/layout')
      }
    }, 1000)
    return () => clearInterval(timeID)
  }, [])

  useEffect(() => {
    ref.current = second
  }, [second])

  return (
    <div>
      你访问的页面不存在<Link to="/layout">{second}秒后返回首页</Link>
    </div>
  )
}

export default NotFound

// 1、useRef()会返回一个不可变的对象（ref对象在组件多次渲染时是不会变的，但该对象内部的current属性值可变）
// 2、useRef()生成的对象会贯穿组件内的闭包，不会受组件重新渲染而改变，这个hook生成的对象是不会变的，该特性对于在同一组件中会很有用
// 3、例如同一个组件中多个useEffect钩子中，利用useRef()这个特性用于清除定时器ID
// -、即组件内 const ref = useRef();
// -、useEffect(()=>{ ref.current = setTimeout(fn, 1000); } return ()=>{ clearTimeout(ref.current) })
// -、如此一来多个useEffect钩子内都可以通过同一个组件渲染中不会发生变化的对象ref贯穿，后续变化可以赋值给current属性
// 4、同一组件中无论有多少个闭包，useRef()生成的对象是同一个且不变的，但该对象的current属性是可变的（因此可以与state结合实现一些功能）
// -、const ref = useRef(xxx);
// -、useEffect(()=>{ setXxx(ref.current - 1); if (ref.current <= 1) { clearInterval(timeID)} },[]);
// -、 useEffect(()=>{ ref.current = xxx },[xxx])
// -、此时异步内无法及时获取闭包中state的变化，但它最新的值可以赋值给ref.current，如此其他闭包可以通过ref.current就拿到了闭包中最新状态的值
