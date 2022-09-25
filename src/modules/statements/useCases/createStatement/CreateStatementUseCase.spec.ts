import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { CreateStatementError } from "./CreateStatementError"

let userRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

describe("Create Statement", () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    userRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepository)
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementsRepository)
  })

  it('Should be able to show Statement Operation', async () => {
    const data = {
      name: 'John Do',
      email: 'johndo@gmail.com',
      password: '12345'
    } as ICreateUserDTO

    const user = await createUserUseCase.execute(data)

    const data1 = {
      amount: 100,
      description: 'Descripition test',
      type: 'deposit',
      user_id: user.id
    } as ICreateStatementDTO

    const statement = await createStatementUseCase.execute(data1)

    expect(statement).toHaveProperty('id')

  })

  it('Should not be able to make a withdrawal operation greater than the balance', async () => {

    try {
      const data = {
        name: 'John Do',
        email: 'johndo@gmail.com',
        password: '12345'
      } as ICreateUserDTO

      const user = await createUserUseCase.execute(data)

      const data1 = {
        amount: 100,
        description: 'Descripition test',
        type: 'deposit',
        user_id: user.id
      } as ICreateStatementDTO

      const data2 = {
        amount: 2000,
        description: 'Descripition test',
        type: 'withdraw',
        user_id: user.id
      } as ICreateStatementDTO

      await createStatementUseCase.execute(data1)
      await createStatementUseCase.execute(data2)

    } catch (error) {
      expect(error).toBeInstanceOf(CreateStatementError.InsufficientFunds)
    }
  })

  it('Should not be able to create Statement Operation whith user id does not exist', async () => {

    try {
      const data = {
        name: 'John Do',
        email: 'johndo@gmail.com',
        password: '12345'
      } as ICreateUserDTO

      await createUserUseCase.execute(data)

      const data1 = {
        amount: 100,
        description: 'Descripition test',
        type: 'deposit',
        user_id: '232'
      } as ICreateStatementDTO

      await createStatementUseCase.execute(data1)

    } catch (error) {
      expect(error).toBeInstanceOf(CreateStatementError.UserNotFound)
    }
  })
})
