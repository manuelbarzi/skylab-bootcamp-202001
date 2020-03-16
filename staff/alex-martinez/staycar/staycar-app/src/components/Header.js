import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { Context } from './ContextProvider'
import { logout } from '../logic'
import './style/Header.sass'

import parking from './icons/pk-parking.png'


export default withRouter (function({user, history}) {

    const [, setState] = useContext(Context)

    function handleLogout() {
        logout()

        setState({ page: 'home' })

        history.push('/home')
    }

    function handleToHome() {
        history.push('/home')
    }


    return <header>
        <section className="logo">
            <img src={parking} className="logo__icon" alt="" onClick={handleToHome}/>
            <p className="logo__text"><a href="#">StayCar</a></p>
        </section>
        <section className="logout">
        {user === 'Login' && <Link onClick={handleLogout} className="logout__text">Logout</Link> }
        {user === 'Logout' && <Link to="/login" className="logout__text">Login</Link> }
        </section>
    </header>
})