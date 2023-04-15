const AppError = require("../utils/AppError")
const knex = require("../database/knex")
const brcrypt = require("bcryptjs")
const UserRepository = require("../repositories/UserRepository")
const UserCreateService = require("../services/UserCreateService")

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body

    const userRepository = new UserRepository()
    const userCreateService = new UserCreateService(userRepository)

    await userCreateService.execute({ name, email, password })

    return response.json()
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const user_id = request.user.id

    const [user] = await knex("users").where("id", user_id)

    if (!user) {
      throw new AppError("Usuário não existe!")
    }

    const [userWithUpdatedEmail] = await knex("users")
      .select()
      .where("email", email)

    if (userWithUpdatedEmail && userWithUpdatedEmail.id != user.id) {
      throw new AppError("Email ja cadastrado em outro usuário!")
    }

    user.name = name ?? user.name
    user.email = email ?? user.name

    if (password && !old_password) {
      throw new AppError(
        "É necessario informar a senha antiga para atualizar a nova senha"
      )
    }

    if (password && old_password) {
      const checkOldPassword = await brcrypt.compare(
        old_password,
        user.password
      )

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.")
      }

      user.password = await brcrypt.hash(password, 8)

      await knex("users").where("id", user_id).update({
        name: user.name,
        email: user.email,
        password: user.password,
        updated_at: knex.fn.now(),
      })
    }
    return response.json()
  }
}

module.exports = UserController
