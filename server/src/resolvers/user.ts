import argon2 from "argon2"
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"
import { DUPLICATE_USERNAME_CODE } from "../constants"
import { User, UserResponse, UsernamePasswordInput } from "../entities/User"
import { ApolloContext } from "../types"

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, emFork }: ApolloContext): Promise<User | null> {
    if (!req.session.userId) return null

    const user = await emFork.findOne(User, { id: req.session.userId })
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { emFork, req }: ApolloContext
  ): Promise<UserResponse> {
    if (options.username.length < 3) {
      return {
        errors: [
          {
            field: "username",
            message: "Username must be at least 3 characters long.",
          },
        ],
      }
    }

    if (options.password.length < 8) {
      return {
        errors: [
          {
            field: "password",
            message: "Password must be at least 8 characters long.",
          },
        ],
      }
    }

    const hashedPassword = await argon2.hash(options.password)

    const user = emFork.create(User, {
      username: options.username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    try {
      await emFork.persistAndFlush(user)
    } catch (error) {
      if (error.code === DUPLICATE_USERNAME_CODE) {
        return {
          errors: [
            {
              field: "username",
              message: "This username already exists.",
            },
          ],
        }
      }
    }

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { emFork, req }: ApolloContext
  ): Promise<UserResponse> {
    const user = await emFork.findOne(User, { username: options.username })
    if (!user)
      return {
        errors: [
          {
            field: "username",
            message: "The username doesn't exist.",
          },
        ],
      }

    const validPassword = await argon2.verify(user.password, options.password)
    if (!validPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password.",
          },
        ],
      }
    }

    req.session.userId = user.id

    return { user }
  }
}
