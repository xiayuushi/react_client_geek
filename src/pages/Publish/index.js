import { useState } from 'react'

const Publish = () => {
  const [count, setCount] = useState(0)
  console.log(count)

  const setCountHandler = () => {
    setCount(count + 1)
  }
  const getCountHandler = () => {
    setTimeout(() => {
      console.log(count)
    }, 3000)
  }

  return (
    <div>
      <button onClick={setCountHandler}>设置</button>
      <button onClick={getCountHandler}>延迟获取</button>
    </div>
  )
}

export default Publish
