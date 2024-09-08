import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider, InMemoryCache, ApolloClient, HttpLink, ApolloLink, concat } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('token');

    operation.setContext({
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    });

    return forward(operation);
});

const client = new ApolloClient({
    link: concat(authLink, new HttpLink({ uri: '/graphql' })),
    cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ApolloProvider>
    </React.StrictMode>
);