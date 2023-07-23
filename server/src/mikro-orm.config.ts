import { defineConfig } from "@mikro-orm/postgresql"
import path from "path"
import { __prod__ } from "./constants"
import { Post } from "./entities/Post"
import { User } from "./entities/User"

export default defineConfig({
  dbName: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  debug: !__prod__,
  entities: [Post, User],
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
})
