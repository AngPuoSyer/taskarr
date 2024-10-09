import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { OpenAPI as OpenAPIConfig } from '@taskarr/ui/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react'
import { DefaultErrorFunction, SetErrorFunction } from "@sinclair/typebox/errors";

OpenAPIConfig.BASE = process.env.BACKEND_URL as string

SetErrorFunction((error) => {
	return error?.schema?.errorMessage ?? DefaultErrorFunction(error);
});

const queryClient = new QueryClient()

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<ChakraProvider>
				<Head>
					<title>Taskarr</title>
				</Head>
				<main className="app">
					<QueryClientProvider client={queryClient}>
						<Component {...pageProps} />
					</QueryClientProvider>
				</main>
			</ChakraProvider>
		</>
	);
}

export default CustomApp;
