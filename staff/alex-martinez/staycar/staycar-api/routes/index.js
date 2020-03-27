const { Router } = require('express')
//require handlers
const { registerUser, 
    authenticateUser, 
    retrieveUser, 
    entryVehicle, 
    addLotsAmount,
    createParking,
    retrieveParking,
    retrieveTicket,
    validateTicket,
    exitVehicle ,
    deleteParking,
    deleteUser,
    retrieveTickets,
    updateParking} = require('./handlers')
//

const { jwtVerifierMidWare } = require('../mid-wares')
const bodyParser = require('body-parser')

const jsonBodyParser = bodyParser.json()


const router = new Router()

//routes
router.post('/users', jsonBodyParser, registerUser)
router.post('/users/auth', jsonBodyParser, authenticateUser)
router.get('/users', jwtVerifierMidWare, retrieveUser)

router.post('/:name/ticket', jsonBodyParser, entryVehicle)

router.post('/parking/create', jwtVerifierMidWare, jsonBodyParser, createParking)
router.get('/parking', retrieveParking)
router.delete('/parking/:parking', jwtVerifierMidWare, deleteParking)
router.delete('/users', jwtVerifierMidWare, jsonBodyParser, deleteUser)
router.get('/ticket/:id/:parkingname', retrieveTicket)
router.get('/tickets', retrieveTickets)

router.patch('/ticket/:id/validated', jsonBodyParser, validateTicket)
router.get('/ticket/:ticketId/:parkingname/exit', exitVehicle)

//router.patch('/parking/:id/update', jsonBodyParser, jwtVerifierMidWare, addLotsAmount)
//router.patch('/parking/:name/update', jsonBodyParser, jwtVerifierMidWare, addLotsAmount)
router.patch('/parking/:name/update', jsonBodyParser, jwtVerifierMidWare, updateParking)
//


//export router
module.exports = router