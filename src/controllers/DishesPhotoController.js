const knex = require('../database/knex')

const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/diskStorage')

class DishesPhotoController {
    async update(req, res) {
        const { dish_id } = req.params
        const photoFilename = req.file.filename 

        const diskStorage = new DiskStorage()
        const dish = await knex('dishes').where({ id: dish_id }).first()
        
        if(!dish){
            throw new AppError('Prato não existe')
        }
        
        if(dish.photo){
            await diskStorage.deleteFile(dish[0].photo)
        }
        
        const filename = await diskStorage.saveFile(photoFilename)

        dish.photo = filename

        await knex('dishes').update(dish).where({ id: dish_id })

        return res.json(dish)
    }
}

module.exports = DishesPhotoController