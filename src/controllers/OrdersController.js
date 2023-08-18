const knex = require('../database/knex')

const AppError = require('../utils/AppError')

const sqliteConnection = require('../database/sqlite')

class IngredientsController {
    async create(req, res) {
        const { status, details } = req.body
        const user_id = req.user.id;

        await knex('orders').insert({
            status,
            details,
            user_id
        })

        return res.status(201).json()
    }

    async delete(request, response) {
        const { id } = request.params

        await knex('orders').where({ id }).delete()

        return response.json()
    }

    async update(req, res) {
        const { status, details } = req.body
        const { id } = req.params

        const database = await sqliteConnection()
        const order = await database.get('SELECT * FROM orders WHERE id = (?)', [id])

        if (!order) {
            throw new AppError('Pedido não encontrado')
        }

        order.status = status ?? order.status
        order.details = details ?? order.details

        await database.run(`
            UPDATE orders SET 
            status = ?,
            details = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`, [order.status, order.details, id])

        return res.json()
    }

    async show(req, res) {

        const { id } = req.params

        const order = await knex('orders').where({ id }).first()

        return res.json(order)
        
    }
    
    async index(req, res) {
        const { user_id } = req.query

        const allOrders = await knex('orders').where({ user_id }).orderBy('status')

        return res.json(allOrders)
    }
}

module.exports = IngredientsController