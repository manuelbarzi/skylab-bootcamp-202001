require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { models: { User, Game } } = require('simonline-data')
const { expect } = require('chai')
const { random } = Math
require('../../simonline-utils/shuffle')()
const playCombination = require('./play-combination')
const { mongoose } = require('simonline-data')

describe('play combination', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    )

    let name, owner, username, password

    beforeEach(() => {
        username = `username-${random()}`
        password = `password-${random()}`
        name = `name-${random()}`
    })

    describe('when user and game already exists', () => {
        let gameId, playerId, player1
        let combinationPlayer = [2]
        
        beforeEach(async() => {
            let users = []
            let combination = 2

            for (let i = 0; i < 10; i++)
                await User.create({ username, password })
                    .then(user => {
                        owner = user.id
                        playerId = user.id
                        users.push(user.id)
                    })

                await Game.create({ name, owner })
                    .then(game => {
                        game.players = users
                        game.players.shuffle()
                        gameId = game.id
                        game.pushCombination.push(combination)
                        game.turnStart = new Date()
                        game.currentPlayer = game.players[0]
                        game.status = "started"
                        game.turnTimeout = 40
                        player1 = game.currentPlayer
                        return game.save()
                    })
        })

        it('should succeed matching correct combination, change current player and push new combination', async () => {
            await playCombination(playerId, combinationPlayer)
                .then(game => { 
                    expect(game).to.exist
                    expect(game.pushCombination.length).to.equal(2)
                    expect(game.pushCombination).to.be.an.instanceOf(Array)
                    expect(game.watching).to.be.empty
                    expect(game.watching).to.be.an.instanceOf(Array)
                    expect(game.combinationViewed).to.be.empty
                    expect(game.combinationViewed).to.be.an.instanceOf(Array)
                })
        })

        it('should fail matching incorrect combination, player has moved to watching and non pushed combination', async () => {
            
            combinationPlayer = [1]

            await playCombination(playerId, combinationPlayer)
                .then(game => {                   
                    expect(game).to.exist
                    expect(game.pushCombination).to.have.lengthOf(1)
                    expect(game.pushCombination).to.be.an.instanceOf(Array)
                    expect(game.watching).to.have.lengthOf(1)
                    expect(game.watching).to.be.an.instanceOf(Array)
                    expect(game.combinationViewed).to.be.empty
                    expect(game.combinationViewed).to.be.an.instanceOf(Array)
                })
        })

        it('should fail on a non-string playerId', () => {
            let playerId = 1
            expect(() => playCombination(playerId, combinationPlayer)).to.throw(TypeError, `playerId ${playerId} is not a string`)

            playerId = false
            expect(() => playCombination(playerId, combinationPlayer)).to.throw(TypeError, `playerId ${playerId} is not a string`)

            playerId = undefined
            expect(() => playCombination(playerId, combinationPlayer)).to.throw(TypeError, `playerId ${playerId} is not a string`)

            playerId = []
            expect(() => playCombination(playerId, combinationPlayer)).to.throw(TypeError, `playerId ${playerId} is not a string`)
        })

        it('should fail on a non-object combinationPlayer', () => {
            let combinationPlayer = 1
            expect(() => playCombination(playerId, combinationPlayer)).to.throw(TypeError, `combination ${combinationPlayer} is not a object`)

            combinationPlayer = false
            expect(() => playCombination(playerId, combinationPlayer)).to.throw(TypeError, `combination ${combinationPlayer} is not a object`)

            combinationPlayer = undefined
            expect(() => playCombination(playerId, combinationPlayer)).to.throw(TypeError, `combination ${combinationPlayer} is not a object`)

            combinationPlayer = 'a'
            expect(() => playCombination(playerId, combinationPlayer)).to.throw(TypeError, `combination ${combinationPlayer} is not a object`)
        })

    })

})

after(() => Promise.all([User.deleteMany(), Game.deleteMany()]).then(() => mongoose.disconnect()))

