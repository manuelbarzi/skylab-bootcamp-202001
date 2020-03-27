import React, { useEffect } from 'react'
import './Navigation.sass'

export default function ({onGoToContact, onGoToSearch, onGoToSails, onGoToUpdate, onGoToLogout, onGoToShopping}) {
    
    function handleGoToContact(event) {
        event.preventDefault()

        onGoToContact()
    }
    function handleGoToSearch(event) {
        event.preventDefault()

        onGoToSearch()
    }
    function handleGoToSails(event) {
        event.preventDefault()

        onGoToSails()
    }
    function handleGoToUpdate(event) {
        event.preventDefault()

        onGoToUpdate()
    }
    function handleGoToOut(event){
        event.preventDefault()

        onGoToLogout()
    }
    function handleGoToShopping(event){
        event.preventDefault()

        onGoToShopping()
    }
    
    
    return <> 
    <div className="leftIcon">
        <ul>
            <li className="leftIcon__home"><a href="" onClick = {handleGoToSearch}><i className="fa fa-home"></i></a>
            </li>
            <li className="leftIcon__users"><a href="" onClick = {handleGoToUpdate}><i className="fa fa-users"></i></a>
            </li>
            <li className="leftIcon__shopping"><a href="" onClick={handleGoToShopping}><i className="fa fa-shopping-cart"></i></a>
            </li>
            <li className="leftIcon__discount"><a href="" onClick = {handleGoToSails}><i className="fa fa-percent"></i></a>
            </li>
            <li className="leftIcon__contact"><a href="" onClick = {handleGoToContact}><i className="fa fa-envelope"></i></a>
            </li>
        </ul>
     </div>

    <div className="righticon">
        <div className="righticonin">
        <a href="javascript:void('0')" className="miniCartbtn" onClick = {handleGoToOut}><i className="fas fa-power-off"></i></a>
        </div>
    </div>
    </>
}