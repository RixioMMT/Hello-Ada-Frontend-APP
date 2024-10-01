import React, { useState } from 'react';
import { useMutation, useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SIGN_UP = gql`
    mutation SignUp($userInput: UserInput!) {
        signUp(userInput: $userInput)
    }
`;

const LOG_IN = gql`
    mutation LogIn($logInInput: LogInInput!) {
        logIn(logInInput: $logInInput)
    }
`;

const GET_USER_ID_BY_EMAIL = gql`
    query GetUserIdByEmail($userEmail: String!) {
        getUserIdByEmail(userEmail: $userEmail)
    }
`;

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [register, { error: registerError }] = useMutation(SIGN_UP);
    const [login, { error: loginError }] = useMutation(LOG_IN);
    const [getUserIdByEmail] = useLazyQuery(GET_USER_ID_BY_EMAIL);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('taskId');
        try {
            await register({
                variables: { userInput: { email, password } },
            });

            const { data } = await login({
                variables: { logInInput: { email, password } },
            });

            const token = data.logIn;
            localStorage.setItem('token', token);

            const decodedToken = jwtDecode(token);
            const userEmail = decodedToken?.sub || email;

            const { data: userData } = await getUserIdByEmail({ variables: { userEmail } });
            const userId = userData?.getUserIdByEmail;

            if (userId) {
                localStorage.setItem('userId', userId);
                alert('Registration and login successful!');
                navigate('/tasks');
            } else {
                throw new Error('User ID not found.');
            }
        } catch (err) {
            console.error('Error during registration or login:', err);
            localStorage.removeItem('token');
            alert('Registration or login failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
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
                <br/>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br/>
                <button type="submit">Register</button>
            </form>
            {registerError && <p style={{color: 'red'}}>Registration failed: {registerError.message}</p>}
            {loginError && <p style={{color: 'red'}}>Login failed: {loginError.message}</p>}
            <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
    );
}

export default RegisterPage;