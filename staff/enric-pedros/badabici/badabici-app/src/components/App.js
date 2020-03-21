import React, { useState, useEffect, useContext } from 'react'
import Page from './Page'
import Register from './Register'
import Login from './Login'
import Search from './Search'
import Header from './Header'
import Navigation from './Navigation'
import LoginAdmin from './LoginAdmin'
import Landing from './Landing'
import { registerUser, login, isLoggedIn, retrieveUser,loginAdmin } from '../logic' 
import { Context } from './ContextProvider'
import { Route, withRouter, Redirect } from 'react-router-dom'

export default withRouter(function ({ history }) {
  const [state, setState] = useContext(Context) //use context és per contexte global
  const [user, setUser] = useState([]) // aquest hook és per poder-lo utilitzar en tots els components que interesen

  useEffect(() => {
    if (isLoggedIn()) {

      history.push('/search')
    } else {

      history.push('/landing')
    }
  }, [])

  async function handleRegister(name, surname, email, password) {
    try {
      await registerUser(name, surname, email, password)

    history.push('/login')
    } catch ({ message }) {
      
      history.push('/register')
      setState({...state, error:message})
     

      setTimeout(() => {
        setState({...state, error:undefined})
      }, 3000)
    }
  }

  async function handleLogin(email, password) {
    try {
      await login(email, password)
      const user = await retrieveUser() 
      setUser(user)

      history.push('/search')
    } catch ({ message }) {
      setState({ ...state, error: message })

      setTimeout(() => {
        setState({...state, error:undefined})
      }, 3000)
    }
  }
  async function handleLoginAdmin(email, password) {
    try {
      await loginAdmin(email, password)
      const user = await retrieveUser() 
      setUser(user)

      history.push('/search')
    } catch ({ message }) {
      setState({ ...state, error: message })

      setTimeout(() => {
        setState({...state, error:undefined})
      }, 3000)
    }
  }

  function handleGoToLogin() {
    history.push('/login')
  }

  function handleGoToRegister() {
    history.push('/register')
  }
  function handleGoToSearch() {
    history.push('/search')
  }
  function handleGoToAdmin() {
    history.push('/loginAdmin')
  }

  function handleMountLogin() {
    setState({ page: 'login' })
  }

  function handleMountRegister() {
    setState({ page: 'register' })
  }

  function handleMountSearch() {
    setState({ page: 'search' })
  }
 

  const { page, error } = state

  return <div className="app">
    <Page name={page}>
      <Route exact path="/" render={() => isLoggedIn() ? <Redirect to="/search" /> : <Redirect to="/landing" />} />       {/*esto es para hacer rutas exactas i que no te coja el primer route si se repiten*/}
      <Route path="/register" render={() => isLoggedIn() ? <Redirect to="/search" /> : <Register onSubmit={handleRegister} error={error} onGoToLogin={handleGoToLogin} onMount={handleMountRegister} />} />
      <Route path="/login" render={() => isLoggedIn() ? <Redirect to="/search" /> : <Login onSubmit={handleLogin} error={error} onGoToRegister={handleGoToRegister} onMount={handleMountLogin} />} />
      <Route path="/search" render={() => isLoggedIn() ? <><Header  onGoToLogin={handleGoToLogin} onGoToRegister={handleGoToRegister} handleGoToAdmin={handleGoToAdmin}/><Navigation/><Search onMount={handleMountSearch}/></> : <Redirect to="/login" />} />
      <Route path="/loginAdmin" render={() => /* isLoggedIn() ? <Redirect to="/search" /> : */ <LoginAdmin onSubmit={handleLoginAdmin} error={error} onGoToSearch={handleGoToSearch} />} />
      <Route path="/landing" render={() => /* isLoggedIn() ? <Redirect to="/search" /> : */ <Landing onSubmit={handleLoginAdmin} error={error} onGoToSearch={handleGoToSearch} />} />
    </Page>
  </div>
}) 