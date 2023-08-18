const AppError = require('../../utils/AppError')

class DishCreateService {
    constructor(dishRepository) {
        this.dishRepository = dishRepository
    }

    async execute({ name, description, price, type, ingredients }) {
        const dishCreated = await this.dishRepository.create({ name, description, price, type, ingredients })

        return dishCreated
    }
}

module.exports = DishCreateService