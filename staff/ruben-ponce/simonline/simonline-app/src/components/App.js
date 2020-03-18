import React, { useState, useEffect, useContext } from 'react'
import './App.sass'
import { Landing, Login, Register, Home, Multiplayer, Create, Join, Page } from './'
import { register, login, isLoggedIn } from '../logic'
import { Context } from './ContextProvider'
import { Route, withRouter, Redirect } from 'react-router-dom'

export default withRouter(function ({ history }) {

  const [state, setState] = useContext(Context)

  useEffect(() => {
    if (isLoggedIn()) {
      history.push('/home')
    } else {
      history.push('/landing')
    }
  }, [])

  async function handleRegister(username, password) {
    try {
      await register(username, password)
        history.push('./login')
    } catch ({ message }) {
        setState({ error: message })
    }
  }

  async function handleLogin(username, password) {
    try {
      await login(username, password)
        history.push('/home')
    } catch ({ message }) {
        setState({ ...state, error: message })
    }
  }

  function handleGoToLogin() {
    history.push('/login')
  }

  function handleGoToRegister() {
    history.push('/register')
  }

  function handleGoToLanding() {
    history.push('/landing')
  }

  const { page, error } = state

  return <div className="app">
      <Route exact path="/" render={() => isLoggedIn() ? <Redirect to="/home" /> : <Redirect to="/landing" />} />
      <Route path="/landing" render={() => isLoggedIn() ? <Redirect to="/home" /> : <Landing onGoToLogin={handleGoToLogin} onGoToRegister={handleGoToRegister} />} />
      <Route path="/register" render={() => isLoggedIn() ? <Redirect to="/home" /> : <Register onSubmit={handleRegister} error={error} onGoToLogin={handleGoToLogin} onGoToLanding={handleGoToLanding}/>} />
      <Route path="/login" render={() => isLoggedIn() ? <Redirect to="/home" /> : <Login onSubmit={handleLogin} error={error} onGoToRegister={handleGoToRegister} onGoToLanding={handleGoToLanding}/>} />
      <Route path="/home/" render={() => isLoggedIn() ? <Home /> : <Redirect to="/landing" />} />
  </div>
})