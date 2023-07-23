import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react"
import { useField } from "formik"
import { InputHTMLAttributes } from "react"

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label: string
}

export default function InputField({ label, size, ...props }: InputFieldProps) {
  const [field, { error }] = useField(props)

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      {}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}
