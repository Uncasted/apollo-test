import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql"
import { Request, Response } from "express"

export type ApolloContext = {
  emFork: SqlEntityManager<PostgreSqlDriver>
  req: Request
  res: Response
}

declare module "express-session" {
  interface Session {
    userId: number
  }
}
