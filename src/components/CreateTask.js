import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

export const ADD_TASK = gql`
    mutation AddTask($taskInput: TaskInput!, $userId: ID!) {
        addTask(taskInput: $taskInput, userId: $userId) {
            id
            title
            description
        }
    }
`;

function CreateTask() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState(null);
    const [createTask] = useMutation(ADD_TASK);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            alert('User not logged in.');
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            alert('User ID is missing.');
            return;
        }
        try {
            await createTask({
                variables: {
                    taskInput: { title, description },
                    userId,
                },
            });
            alert('Task created!');
            navigate('/tasks');
        } catch (error) {
            console.error('Create task error:', error);
            alert('Failed to create task. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('taskId');
        navigate('/login');
    };

    return (
        <div>
            <h2>Create Task</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <br/>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <br/>
                <button type="submit">Create Task</button>
            </form>
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
}

export default CreateTask;