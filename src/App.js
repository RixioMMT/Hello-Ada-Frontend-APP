import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import CreateTask from './components/CreateTask';
import EditTask from './components/EditTask';
import TaskList from './components/TaskList';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Navigate to="/register" />} />
                <Route path="/app" element={<h1>Welcome to App</h1>} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/create-task" element={<CreateTask />} />
                <Route path="/edit-task" element={<EditTask />} />
                <Route path="/tasks" element={<TaskList />} />
            </Routes>
        </div>
    );
}

export default App;