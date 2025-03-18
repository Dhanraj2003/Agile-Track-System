import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { Card, Button, Form, InputGroup, Container, ListGroup } from 'react-bootstrap';

const UserProfile = () => {
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('employee');
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://agile-track-system-1.onrender.com/users');
                if (user?.role === 'admin') {
                    setUsers(response.data.filter(user => user?.role !== 'admin'));
                } else {
                    setSelectedUser(user);
                    fetchTasks(user?.id);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [user]);

    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get(`https://agile-track-system-1.onrender.com/tasks?assignedTo=${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    /* Sets the selected user when the "Get History" button is clicked.
    Fetches tasks related to the selected user. */
    const handleGetHistory = (userId) => {
        setSelectedUser(users.find(user => user?.id === userId));
        fetchTasks(userId);
    };

    const handleAddUser = async (event) => {
        event.preventDefault();
        try {
            await axios.post('https://agile-track-system-1.onrender.com/users', {
                name: newUserName,
                email: newUserEmail,
                password: newUserPassword,
                role: newUserRole,
            });
            const updatedUsers = await axios.get('https://agile-track-system-1.onrender.com/users');
            setUsers(updatedUsers.data.filter(user => user?.role !== 'admin'));
            setShowForm(false);
            setNewUserName('');
            setNewUserEmail('');
            setNewUserPassword('');
            setNewUserRole('employee');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <Container className="py-5">
            <h2 className="text-center mb-4">User Profiles</h2>
            {user?.role === 'admin' && (
                <Card className="p-4 mb-4 shadow-lg">
                    <Button onClick={() => setShowForm(!showForm)} className="mb-3 btn-info">
                        {showForm ? 'Cancel' : 'Add New User'}
                    </Button>
                    {showForm && (
                        <Form onSubmit={handleAddUser} className="mb-4">
                            <InputGroup className="mb-3">
                                <Form.Control placeholder="Name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <Form.Control placeholder="Email" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} required />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <Form.Control placeholder="Password" type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <Form.Select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} required>
                                    <option value="employee">Employee</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </InputGroup>
                            <Button type="submit" variant="success">Create User</Button>
                        </Form>
                    )}
                    <ListGroup>
                        {users.map(user => (
                            <ListGroup.Item key={user?.id} className="d-flex justify-content-between align-items-center">
                                {user?.name} - {user?.email}
                                <Button variant="primary" onClick={() => handleGetHistory(user?.id)}>Get History</Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            )}
            {selectedUser && (
                <Card className="p-4 mt-4 shadow-lg">
                    <h3>Tasks Worked By {selectedUser.name}</h3>
                    <ListGroup>
                        {tasks.map(task => (
                            <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
                                <strong>{task.title}</strong> - {task.description} (Status: {task.status})
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            )}
        </Container>
    );
};

export default UserProfile;
