import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const GET_TASKS_BY_USER = gql`
    query GetTasksByUser($userId: ID!) {
        getAllTasksByUser(userId: $userId) {
            id
            title
            description
        }
    }
`;

const DELETE_TASK = gql`
    mutation DeleteTask($taskId: ID!, $userId: ID!) {
        deleteTask(taskId: $taskId, userId: $userId)
    }
`;

function TaskList() {
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    // Use refetch function from useQuery
    const { loading, error, data, refetch } = useQuery(GET_TASKS_BY_USER, {
        variables: { userId },
        skip: !userId,
    });

    const [deleteTask] = useMutation(DELETE_TASK);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
    }, []);

    useEffect(() => {
        if (data && data.getAllTasksByUser) {
            refetch();
        }
    }, [data, refetch]);

    const handleDelete = async (taskId) => {
        try {
            await deleteTask({
                variables: { taskId, userId },
            });
            refetch();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete the task. Please try again.');
        }
    };

    const handleEdit = (taskId) => {
        localStorage.setItem('taskId', taskId);
        navigate(`/edit-task`);
    };

    const handleLogout = () => {
        // Clear items from local storage
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('taskId');
        navigate('/login');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h2>Task List</h2>
            <button onClick={() => navigate('/create-task')}>Create New Task</button>
            <ul>
                {data && data.getAllTasksByUser.length > 0 ? (
                    data.getAllTasksByUser.map(task => (
                        <li key={task.id}>
                            <h3>{task.title}</h3>
                            <p>{task.description}</p>
                            <button onClick={() => handleEdit(task.id)}>Edit</button>
                            <button onClick={() => handleDelete(task.id)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}
            </ul>
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
}

export default TaskList;