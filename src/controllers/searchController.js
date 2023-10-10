const knex = require('../database/knex')
const AppError = require('../utils/AppError')

class searchController{
    async show (req, res) {
        const { query } = req.query;
    
        try {
            const results = await knex('dishes')
                                  .where('name', 'like', `%${query}%`)
                                  .orWhere('ingredients', 'like', `%${query}%`)
                                  .select('id', 'name', 'description', 'price', 'type', 'photo', 'ingredients');
            
            res.json(results);
        } catch (error) {
            alert('Erro ao buscar pratos:');
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }    
}

module.exports = searchController