import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { Field, InputType, ObjectType } from "type-graphql"
import { FieldError } from "./FieldError"

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number

  @Field()
  @Property({ type: "text", unique: true })
  username!: string

  @Property({ type: "text" })
  password!: string

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date()

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date()
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string
}
