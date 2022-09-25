import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let getStatementOperationUseCase: GetStatementOperationUseCase
let userRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase

describe("Show Statement Operation", () => {

  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository()
    userRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(userRepository)
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementsRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepository, statementsRepository)
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
    const result = await getStatementOperationUseCase.execute({
      statement_id: statement.id,
      user_id: user.id
    })
    expect(result).toEqual(statement)

  })

  it('Should not be able to show Statement Operation whith user id does not exist', async () => {

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

      const statement = await createStatementUseCase.execute(data1)
      await getStatementOperationUseCase.execute({
        statement_id: statement.id,
        user_id: '123'
      })
    } catch (error) {
      expect(error).toBeInstanceOf(GetStatementOperationError.UserNotFound)
    }
  })

  it('Should not be able to show Statement Operation whith user id does not exist', async () => {

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

      const statement = await createStatementUseCase.execute(data1)
      await getStatementOperationUseCase.execute({
        statement_id: '12',
        user_id: user.id
      })
    } catch (error) {
      expect(error).toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    }
  })
})
