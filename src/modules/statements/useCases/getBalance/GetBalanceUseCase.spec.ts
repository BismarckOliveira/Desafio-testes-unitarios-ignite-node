import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetBalanceUseCase } from './GetBalanceUseCase'
import { GetBalanceError } from "./GetBalanceError"

let userRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase
let getBalanceUseCase: GetBalanceUseCase

describe("Get Balance", () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    userRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, userRepository)
    createUserUseCase = new CreateUserUseCase(userRepository)
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementsRepository)
  })

  it('Should be able to get Balance for user', async () => {
    const data = {
      name: 'John Do',
      email: 'johndo@gmail.com',
      password: '12345'
    } as ICreateUserDTO

    const user = await createUserUseCase.execute(data)

    const deposit1 = {
      amount: 100,
      description: 'Descripition test',
      type: 'deposit',
      user_id: user.id
    } as ICreateStatementDTO

    const deposit2 = {
      amount: 500,
      description: 'Descripition test',
      type: 'deposit',
      user_id: user.id
    } as ICreateStatementDTO

    await createStatementUseCase.execute(deposit1)
    await createStatementUseCase.execute(deposit2)

    const result = await getBalanceUseCase.execute({ user_id: user.id })
    expect(result.balance).toEqual(600)
    expect(result.statement.length).toEqual(2)

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

      await createStatementUseCase.execute(data1)
      await getBalanceUseCase.execute({ user_id: '212' })

    } catch (error) {
      expect(error).toBeInstanceOf(GetBalanceError)
    }
  })
})
