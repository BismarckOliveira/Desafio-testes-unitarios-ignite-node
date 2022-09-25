import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let showUserProfileUseCase: ShowUserProfileUseCase
let usersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase


describe("Show User Profile", () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(usersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
  })

  it('Should be able to search User Profile by id', async () => {
    const data = {
      name: 'John Do',
      email: 'johndo@gmail.com',
      password: '12345'
    } as ICreateUserDTO

    const newUser = await createUserUseCase.execute(data)
    const result = await showUserProfileUseCase.execute(newUser.id)
    expect(result).toEqual(newUser)

  })

  it('Should be able to search User Profile by id', async () => {
    const data = {
      name: 'John Do',
      email: 'johndo@gmail.com',
      password: '12345'
    } as ICreateUserDTO


    try {
      await createUserUseCase.execute(data)
      await showUserProfileUseCase.execute('1')
    } catch (error) {
      expect(error).toBeInstanceOf(ShowUserProfileError)

    }

  })
})
