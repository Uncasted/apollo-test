import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql"
import { FieldError } from "./FieldError"

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number

  @Field()
  @Property({ type: "text" })
  title!: string

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date()

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date()
}

@ObjectType()
export class PostResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Post, { nullable: true })
  post?: Post
}
