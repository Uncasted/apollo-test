import { ApolloContext } from "src/types"
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"
import { Post, PostResponse } from "../entities/Post"

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { emFork }: ApolloContext): Promise<Post[]> {
    return await emFork.find(Post, {})
  }

  @Query(() => PostResponse)
  async post(
    @Arg("id") id: number,
    @Ctx() { emFork }: ApolloContext
  ): Promise<PostResponse> {
    try {
      const post = await emFork.findOne(Post, id)

      if (!post) {
        throw new Error()
      }

      return { post }
    } catch (error) {
      return {
        errors: [
          {
            field: "id",
            message: "Post not found, invalid id.",
          },
        ],
      }
    }
  }

  @Mutation(() => PostResponse)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { emFork }: ApolloContext
  ): Promise<PostResponse> {
    if (title.length <= 0) {
      return {
        errors: [
          {
            field: "title",
            message: "The title cannot be empty.",
          },
        ],
      }
    }

    const post = emFork.create(Post, {
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await emFork.persistAndFlush(post)

    return { post }
  }

  @Mutation(() => PostResponse)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() { emFork }: ApolloContext
  ): Promise<PostResponse> {
    if (title.length <= 0) {
      return {
        errors: [
          {
            field: "title",
            message: "The title cannot be empty.",
          },
        ],
      }
    }

    try {
      const post = await emFork.findOne(Post, id)
      if (!post) {
        throw new Error()
      }
      post.title = title
      await emFork.flush()
      return { post }
    } catch (error) {
      return {
        errors: [
          {
            field: "id",
            message: "Post not found, invalid id.",
          },
        ],
      }
    }
  }

  @Mutation(() => PostResponse)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { emFork }: ApolloContext
  ): Promise<PostResponse> {
    try {
      const post = await emFork.findOne(Post, id)

      if (!post) {
        throw new Error()
      }

      await emFork.nativeDelete(Post, id)
      return { post }
    } catch (error) {
      return {
        errors: [
          {
            field: "id",
            message: "Post not found, invalid id.",
          },
        ],
      }
    }
  }
}
