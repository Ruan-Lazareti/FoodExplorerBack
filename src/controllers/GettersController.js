const knex = require('../database/knex')

class GettersController {

    async getMain(req, res) {
        const { type } = req.params

        const dishes = await knex('dishes').where({ type }).orderBy('name')

        return res.json(dishes)
    }
}

module.exports = GettersController