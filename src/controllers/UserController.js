const AppError = require('../utils/AppError')
const knex = require('../database/knex')

const sqliteConnection = require('../database/sqlite')
const { hash, compare } = require('bcryptjs')

const UserRepository = require('../repositories/UserRepository')
const UserCreateService = require('../services/UserCreateService')

class UserController {
    async create(req, res) {
        try {
            const { name, email, password, isAdm } = req.body;

            const userRepository = new UserRepository()
            const userCreateService = new UserCreateService(userRepository)
            await userCreateService.execute({ name, email, password, isAdm })

            return res.status(201).json()
        } catch (e) {
            console.log(e)
        }
    }

    async update(req, res) {
        const { name, email, isAdm, password, oldPassword } = req.body;
        const user_id = req.user.id;

        const database = await sqliteConnection()
        const user = await database.get('SELECT * FROM users WHERE id = (?)', [user_id])

        if (!user) {
            throw new AppError('Usuário não encontrado')
        }

        const userEmailUpdated = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        if (userEmailUpdated && userEmailUpdated.id !== user.id) {
            throw new AppError('Email não disponível')
        }

        user.name = name ?? user.name
        user.email = email ?? user.email
        user.isAdm = isAdm ?? user.isAdm

        if (password && !oldPassword) {
            throw new AppError('Informe a antiga senha, por favor')
        }

        if (password && oldPassword) {
            const checkOldPassword = await compare(oldPassword, user.password)

            if (!checkOldPassword) {
                throw new AppError('Senha inválida ')
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            isAdm = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`, [user.name, user.email, user.isAdm, user.password, user_id])

        return res.json()
    }

    async delete(req, res) {
        const { id } = req.params

        await knex('users').where({ id }).delete()

        return res.json()
    }
}
module.exports = UserController;