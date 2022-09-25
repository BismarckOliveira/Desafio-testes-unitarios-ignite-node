import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import authConfig from "../../../../config/auth";


let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase
let usersRepository: InMemoryUsersRepository

describe("Authenticate User", () => {

  beforeEach(() => {
    authConfig.jwt.secret = "335cd5e290807fd304c6b635e7cb0c5c";
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository)
  })

  it("Should be able to authenticate with valid credentials", async () => {
    const data = {
      name: 'John Do',
      email: 'johndo@gmail.com',
      password: '12345'
    } as ICreateUserDTO

    const credentials = {
      email: 'johndo@gmail.com',
      password: '12345'
    }
    await createUserUseCase.execute(data)
    const result = await authenticateUserUseCase.execute(credentials)
    expect(result).toHaveProperty('token')
    expect(result).toHaveProperty('user')
  })
  it("Should not be able to authenticate with invalid credentials", async () => {
    const user = {
      name: 'John Do1',
      email: 'johndo@gmail.com',
      password: '12345'
    } as ICreateUserDTO

    const credentials = {
      email: 'johndo@gmail.com',
      password: '1234'
    }

    try {
      await createUserUseCase.execute(user)
      await authenticateUserUseCase.execute(credentials)
    } catch (error) {
      expect(error).toBeInstanceOf(IncorrectEmailOrPasswordError)
    }

  })
})
