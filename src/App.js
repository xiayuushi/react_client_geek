import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import Login from '@/pages/Login'
import Layout from '@/pages/Layout'
import NotFound from '@/pages/NotFound'

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Redirect exact from="/" to="/layout"></Redirect>
          <Route path="/login" component={Login} />
          <Route path="/layout" component={Layout} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
