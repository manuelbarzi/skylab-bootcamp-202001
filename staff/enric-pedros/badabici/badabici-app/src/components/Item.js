import React, { useState, useEffect, useContext } from 'react'
import './Item.sass'
import Mustlogged from './Mustlogged'
import Detail from './Detail'
import { Context } from './ContextProvider'
import { retrieveUser, isLoggedIn } from '../logic'
const API_URL = process.env.REACT_APP_API_URL


export default function ({ _sail, onGoToCart, _mustlogged, onGoToDetail, _detail, _search, searchsale }) {
    const [openModal, setOpenModal] = useState(false)
    const [modalLogin, setModalLogin] = useState(false)
    const [user, setUser] = useState()
    const [state, setState] = useContext(Context)
    
    
    useEffect(() => {
        if (isLoggedIn()) {
            (async () => {
                try {
                    const _user = await retrieveUser() 
                    setUser(_user)
                } catch ({ message }) {
                    setState({ ...state, error: message })
                    setTimeout(() => setState({ ...state, error: undefined }), 3000)
                }
            })()
        } else setUser(undefined)
    }, [])
    
    
    function handleToCart(event) {
        event.preventDefault()

        if (_mustlogged) {
            onGoToCart(_sail._id.toString())
        } else {
            setModalLogin(true)
        }
    }

    function handleToDetail(event) {
        event.preventDefault()


        onGoToDetail(_sail._id.toString())
        setOpenModal(true)
    }
    function handleToDetailofSearch(event) {
        event.preventDefault()


        onGoToDetail(_search._id.toString())
        setOpenModal(true)
    }

    const handleModal = () => setOpenModal(!openModal)
    const handleModalLogin = () => setModalLogin(!modalLogin)

    
    if (_sail) { 
        
        searchsale = true

        _sail.price = Number(_sail.price).toFixed(2)
        _sail.discount = Number(_sail.discount).toFixed(2)
        let totaldiscounted = _sail.price-((_sail.discount/100)*(_sail.price))
        debugger
        return <>


             <div className="container-item">
                <div className="container-item__image">
                    <img src="img/bh_aerolight_disc.jpg" alt="" />
                </div>

                <div className="container-item__info">
                    <img src={`${API_URL}/product/${_sail._id}/image`} />
                    <div className='container-item__container-description'>
                        <h3>{_sail.title}</h3>
                        <p>{_sail.description}</p>
                        <div className="container-item__prices">

                            <p className="container-item__price">{_sail.price} EUR</p>
                            <p className="container-item__discounted">{totaldiscounted} EUR </p>
                        </div>
                        <div className='container-item__buttons'>
                            <div className="container-item__tocart"><button className='container-item__buttonmore' onClick={handleToCart}>Add To Cart</button></div>
                            <div className="container-item__details"><button className="container-item__buttonmore" onClick={handleToDetail} >DETAILS</button></div>
                        </div>
                    </div>
                </div>
            </div>

            {modalLogin && <Mustlogged message="detail component" close={handleModalLogin} />}
            {openModal && <Detail message="detail component" close={handleModal} _detail={_detail} />}
        </>
    }
   
    else if(_search){
        debugger
        _search.price = Number(_search.price).toFixed(2)
        _search.discount = Number(_search.discount).toFixed(2)
        let totaldiscountedsearch = _search.price-((_search.discount/100)*(_search.price))

        return <>
            <div className="container-item">
                <div className="container-item__image">
                    <img src="img/bh_aerolight_disc.jpg" alt="" />
                </div>

                <div className="container-item__info">
                    <img src={_search.image} />
                    <div className='container-item__container-description'>
                        <h3>{_search.title}</h3>
                        <p>{_search.description}</p>
                        <div className="container-item__prices">

                            <p className="container-item__price">{_search.price} EUR</p>
                            <p className="container-item__discounted">{totaldiscountedsearch} EUR </p>
                        </div>
                        <div className='container-item__buttons'>
                            <div className="container-item__tocart"><button className='container-item__buttonmore' onClick={handleToCart}>Add To Cart</button></div>
                            <div className="container-item__details"><button className="container-item__buttonmore" onClick={handleToDetailofSearch} >DETALLES</button></div>
                        </div>
                    </div>
                </div>
            </div>

            {modalLogin && <Mustlogged message="detail component" close={handleModalLogin} />}
            {openModal && <Detail message="detail component" close={handleModal} _detail={_detail} />}
        </>
    }

}
