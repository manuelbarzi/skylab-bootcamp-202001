import React, {useState, useEffect} from 'react'
import { withRouter} from 'react-router-dom'
import './style/Home.sass'
import { Header } from '.'
import retrieveParking from '../logic/retrieve-parking'
import { ReactComponent as Access } from './icons/access.svg'
import { ReactComponent as Exit } from './icons/exit.svg'
import { ReactComponent as AtmIcon } from './icons/atm.svg'
import { ReactComponent as Plates } from './icons/plates.svg'
import { ReactComponent as Report } from './icons/report.svg'
import { ReactComponent as Config } from './icons/config.svg'
import { isLoggedIn } from '../logic'


export default withRouter (function({history}) {

    const [state, setState] = useState('free')
    
    const handleGoToEntrance = () => {
        history.push('/entrance')
    }

    const handleToConfig = () => {
        history.push('/config')
    }


    const handleToMap = () => {
        history.push('/map')
    }

    const handleToATM = () => {
        history.push('/atm')
    }

    const handleGoToExit = () => {
        history.push('/exit-vehicle')
    }

    const handleGoToReport = () => {
        history.push('/report')
    }

    const handleParkingFull = async() => {
       const pk = await retrieveParking()
       debugger

        if(pk[0].totalLots === pk[0].occupiedLots){
            setState('fully')
        }else{
            setState('free')
        }
    }

    useEffect(() => {
      handleParkingFull()
    })

    return <>
    <Header user={isLoggedIn() ? 'Login' : ''}/>
    <main>
        
        <section className="actions actions--first">

            <div className={state === 'free' ? "actions__action" : "actions__full"} onClick={ state === 'free' ? handleGoToEntrance : ''}>
            
                <Access className="actions__image" />
                <p className="actions__text">{state === 'free' ? 'Acces' : 'Parking full' }</p>
            </div>

            <div className="actions__action" onClick={handleGoToExit}>
                
                <Exit className="actions__image"/>
                <p className="actions__text">Exit</p>
            </div>

            <div className="actions__action" onClick={handleToATM}>
                
                <AtmIcon className="actions__image"/>
                <p className="actions__text">ATM</p>
            </div>

        </section>

        <section className="actions actions--second">
            
            <div className="actions__action" onClick={handleToMap}>
                
                <Plates className="actions__image"/>
                <p className="actions__text">Map</p>
            </div>
               
            <div className="actions__action" onClick={handleGoToReport}>
                
                <Report className="actions__image"/>
                <p className="actions__text">Report</p>
            </div>

            <div className="actions__action" onClick={handleToConfig}>
                
                <Config className="actions__image"/>
                <p className="actions__text">Config</p>
            </div>
                
        </section>

    </main>
    </>
})