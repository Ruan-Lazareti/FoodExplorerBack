const knex = require('../database/knex')

const AppError = require('../utils/AppError')

const sqliteConnection = require('../database/sqlite')

class IngredientsController {
    async create (req, res) {
        const { name } = req.body

        const database = await sqliteConnection()
        const verifyIngredientExistence = await database.get('SELECT * FROM ingredients WHERE name = (?)', [name])

        if(verifyIngredientExistence){
            throw new AppError('Esse ingrediente já existe')
        }

        await database.run('INSERT INTO ingredients (name) VALUES (?)', [name])

        return res.status(201).json()
    }

    async delete(request, response){
        const { id } = request.params

        await knex('ingredients').where({ id }).delete()

        return response.json()
    }

    async show(req, res){
        const { name } = req.params

        const ingredient = await knex('ingredients').where({ name }).first()

        return res.json(ingredient)
    }

    async index(req, res){
        
            const { user_id } = req.params
    
            const orders = await knex('orders').where({ user_id }).orderBy('name')
    
            return res.json(orders)
        
    }
}

module.exports = IngredientsController