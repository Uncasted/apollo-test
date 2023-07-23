import { graphql } from "../../generated"

export const REGISTER_MUTATION = graphql(`
  mutation Register($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
      user {
        id
        username
      }
      errors {
        field
        message
      }
    }
  }
`)
