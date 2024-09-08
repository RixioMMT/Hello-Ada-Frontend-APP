import React, { useState } from 'react';
import { useMutation, useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const LOG_IN = gql`
    mutation LogIn($logInInput: LogInInput!) {
        logIn(logInInput: $logInInput)
    }
`;

export const GET_USER_ID_BY_EMAIL = gql`
    query GetUserIdByEmail($userEmail: String!) {
        getUserIdByEmail(userEmail: $userEmail)
    }
`;

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { error }] = useMutation(LOG_IN);
    const [getUserIdByEmail] = useLazyQuery(GET_USER_ID_BY_EMAIL);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('taskId');


        try {
            const result = await login({
                variables: {
                    logInInput: {
                        email,
                        password,
                    },
                },
            });

            const token = result.data.logIn;
            localStorage.setItem('token', token);

            const decodedToken = jwtDecode(token);
            const userEmail = decodedToken?.sub || email;

            const { data } = await getUserIdByEmail({ variables: { userEmail } });

            if (data && data.getUserIdByEmail) {
                const userId = data.getUserIdByEmail;
                localStorage.setItem('userId', userId);
                alert('Login successful!');
                navigate('/tasks');
            } else {
                throw new Error('User ID not found.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>Login failed: {error.message}</p>}
            <button onClick={() => navigate('/register')}>Go to Register</button>
        </div>
    );
}

export default LoginPage;