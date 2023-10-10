const knex = require('../database/knex')
const AppError = require('../utils/AppError')

const DishRepository = require('../repositories/DishesRepository')
const DishCreateService = require('../services/dish-services/DishCreateService')

class DishesController{
    async create (req, res){
        const { name, description, price, type, ingredients } = req.body

        const dishRepository = new DishRepository()
        const dishCreateService = new DishCreateService(dishRepository)

        const newDishId = await dishCreateService.execute({ name, description, price, type, ingredients })

        return res.status(201).json({ id: newDishId });
    }

    async show (req, res) {
        const { id } = req.params

        const dish = await knex('dishes').where({ id })

        return res.json(dish)
    }

    async delete(request, response){
        const { id } = request.params

        await knex('dishes').where({ id }).delete()

        return response.json()
    }  
}

module.exports = DishesController