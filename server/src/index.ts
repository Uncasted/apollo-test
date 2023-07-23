import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { MikroORM } from "@mikro-orm/postgresql"
import RedisStore from "connect-redis"
import cors from "cors"
import dotenv from "dotenv"
import express, { json } from "express"
import session from "express-session"
import { createClient } from "redis"
import "reflect-metadata"
import { buildSchema } from "type-graphql"
import mikroConfig from "./mikro-orm.config"
import { PostResolver } from "./resolvers/post"
import { UserResolver } from "./resolvers/user"
import { ApolloContext } from "./types"

async function main() {
  dotenv.config()
  const orm = await MikroORM.init(mikroConfig)
  const emFork = orm.em.fork()
  await orm.getMigrator().up()
  const app = express()

  app.use(
    cors<cors.CorsRequest>({
      origin: [
        process.env.CORS_ORIGIN_CLIENT_URL!,
        process.env.CORS_ORIGIN_APOLLO_STUDIO_URL!,
      ],
      credentials: true,
    })
  )

  const redisClient = createClient()
  redisClient.connect().catch(console.error)

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "test:",
  })

  app.use(
    session({
      name: "qid",
      store: redisStore,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      },
    })
  )

  const apolloServer = new ApolloServer<ApolloContext>({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
  })

  await apolloServer.start()

  app.use(
    "/graphql",
    json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res, emFork }),
    })
  )

  app.listen(process.env.PORT, () => {
    console.log("Express server started on port:", process.env.PORT)
  })
}

main()
