import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO"

let createUserUseCase: CreateUserUseCase
let usersRepository: InMemoryUsersRepository

describe("Create User", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
  })

  it("Should be able to create a new user", async () => {
    const data = {
      name: 'John Do',
      email: 'johndo@gmail.com',
      password: '12345'
    } as ICreateUserDTO

    const result = await createUserUseCase.execute(data)
    expect(result).toHaveProperty('id')
  })
  it("Should not be able to create user with existing email", async () => {
    const data1 = {
      name: 'John Do1',
      email: 'johndo@gmail.com',
      password: '12345'
    } as ICreateUserDTO

    const data2 = {
      name: 'John Do2',
      email: 'johndo@gmail.com',
      password: '12345'
    } as ICreateUserDTO

    try {
      await createUserUseCase.execute(data1)
      await createUserUseCase.execute(data2)
    } catch (error) {
      expect(error).toBeInstanceOf(CreateUserError)
    }

  })
})
