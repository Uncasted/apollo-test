import { Box, Button, VStack } from "@chakra-ui/react"
import { Form, Formik, FormikHelpers } from "formik"
import { useMutation } from "urql"
import InputField from "../components/InputField"
import { REGISTER_MUTATION } from "../graphql/user/mutations"
import { convertToErrorObj } from "../utility"

interface RegisterInput {
  username: string
  password: string
}

export default function Register() {
  const [, register] = useMutation(REGISTER_MUTATION)

  async function handleSubmit(
    values: RegisterInput,
    { setErrors }: FormikHelpers<RegisterInput>
  ) {
    const response = await register(values)
    if (response.data?.register.errors) {
      setErrors(convertToErrorObj(response.data.register.errors))
    }
  }

  return (
    <Box
      maxW="400px"
      border="1px"
      borderColor="gray"
      borderStyle="solid"
      borderRadius="5px"
      mt="1rem"
      p="2rem"
      mx="auto"
    >
      {}
      <Formik
        onSubmit={handleSubmit}
        initialValues={{ username: "", password: "" }}
      >
        {}
        {({ isSubmitting }) => (
          <Form>
            {}
            <VStack spacing={8}>
              <InputField
                label="Username:"
                name="username"
                placeholder="Enter your username..."
              />
              <InputField
                label="Password:"
                name="password"
                placeholder="Enter your password..."
                type="password"
              />
              <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                Sign Up
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
