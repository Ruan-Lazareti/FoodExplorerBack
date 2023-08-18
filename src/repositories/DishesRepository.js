const knex = require('../database/knex')

class DishesRepository {

    async create({name, description, price, type, ingredients}) {
        await knex('dishes').insert({
            name, description, price, type, ingredients
        })
    }

}

module.exports = DishesRepository