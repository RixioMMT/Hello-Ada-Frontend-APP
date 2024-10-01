import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

export const GET_ALL_TASKS_BY_USER = gql`
    query GetAllTasksByUser($userId: ID!) {
        getAllTasksByUser(userId: $userId) {
            id
            title
            description
        }
    }
`;

export const UPDATE_TASK = gql`
    mutation UpdateTask($taskInput: TaskInput!, $taskId: ID!, $userId: ID!) {
        updateTask(taskInput: $taskInput, taskId: $taskId, userId: $userId) {
            id
            title
            description
        }
    }
`;

function EditTask() {
    const [userId, setUserId] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [updateTask] = useMutation(UPDATE_TASK);
    const navigate = useNavigate();

    const taskId = localStorage.getItem('taskId');

    const { loading, error, data } = useQuery(GET_ALL_TASKS_BY_USER, {
        variables: { userId },
        skip: !userId,
    });

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            alert('User not logged in.');
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (data) {
            const task = data.getAllTasksByUser.find(task => task.id === taskId);
            if (task) {
                setSelectedTask(task);
                setTitle(task.title);
                setDescription(task.description);
            }
        }
    }, [data, taskId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || !taskId) {
            alert('User ID or Task ID is missing.');
            return;
        }
        try {
            await updateTask({
                variables: {
                    taskInput: { title, description },
                    taskId,
                    userId,
                },
            });
            alert('Task updated!');
            navigate('/tasks');
        } catch (error) {
            console.error('Update task error:', error);
            alert('Failed to update task. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('taskId');
        navigate('/login');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h2>Edit Task</h2>
            {selectedTask ? (
                <>
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
                        <button type="submit">Update Task</button>
                    </form>
                </>
            ) : (
                <p>Task not found</p>
            )}
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
}

export default EditTask;