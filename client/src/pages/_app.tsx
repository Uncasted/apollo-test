import { ChakraProvider } from "@chakra-ui/react"
import { AppProps } from "next/app"
import { Client, Provider, cacheExchange, fetchExchange } from "urql"
import theme from "../theme"

const urqlClient = new Client({
  url: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL!,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    credentials: "include",
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={urqlClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
