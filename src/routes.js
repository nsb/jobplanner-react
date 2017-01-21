import App from './containers/App'
import Login from './components/Login'
import Test from './components/Test'

export let routes = [
  { path: '/', component: App, indexRoute: { component: Test },
    childRoutes: [
      { path: 'login', component: Login }
    ]
  }
]
