const knex = require('../database/knex')

const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/diskStorage')

class DishesPhotoController {
    async update(req, res) {
        console.log(req.file)
        
        const diskStorage = new DiskStorage()
        
        const { dish_id } = req.params
        const photoFilename = req.file.filename 
        
        const dish = await knex('dishes').where({ id: dish_id })
        
        if(!dish){
            throw new AppError('Ingrediente não existe')
        }
        
        if(dish[0].photo){
            await diskStorage.deleteFile(dish[0].photo)
        }
        
        await diskStorage.saveFile(photoFilename)

        dish[0].photo = photoFilename

        await knex('dishes').update(dish[0]).where({ id: dish_id })

        return res.json(dish)
    }
}

module.exports = DishesPhotoController