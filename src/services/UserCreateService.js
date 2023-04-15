const brcrypt = require("bcryptjs")
const AppError = require("../utils/AppError")

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password }) {
    if (!name) {
      throw new AppError("Nome é Obrigatório!")
    }

    const userWithEmail = await this.userRepository.findByEmail(email)

    if (userWithEmail) {
      throw new AppError("Este email já está em uso!")
    }

    const hashedPassword = await brcrypt.hash(password, 8)

    const userCreated = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    return userCreated
  }
}

module.exports = UserCreateService
