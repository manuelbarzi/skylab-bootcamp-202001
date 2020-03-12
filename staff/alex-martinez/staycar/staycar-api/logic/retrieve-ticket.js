const { validate } = require('staycar-utils')
const { models: { Ticket, Parking } } = require('staycar-data')
const { NotFoundError } = require('staycar-errors')

//const moment = require('moment')

module.exports = (carPlate, parkingName) => {
    validate.string(carPlate, 'carPlate')
    validate.string(parkingName, 'parkingName')


   return (async () => {
        const ticket = await Ticket.findOne({carPlate})
        if(!ticket) throw new NotFoundError('this plate is not inside the parking')
        const parking = await Parking.findOne({parkingName})
        if(!parking) throw new NotFoundError(`parking ${parkingName} is not exist`)
        
        ticket.exitHour = new Date()
        
        let exit = ticket.exitHour
        let entry = ticket.entryHour
        let diff = exit.getTime() - entry.getTime()
        let minutes = Math.floor(diff / 60000);

        const rate = parking.rate
        const totalPrice = parseFloat(minutes * rate)
        ticket.amount = totalPrice

        return ticket
   })()
}