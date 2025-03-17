import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ScrumDetails from '../Scrum Details/ScrumDetails';
import { UserContext } from '../../context/UserContext';
import { Button, Card, CardBody, Form, FormGroup, Label, Input, Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {

      // State variables for storing scrums, selected scrum, form visibility, and users list
    const [scrums, setScrums] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [newScrumName, setNewScrumName] = useState('');
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('To Do');
    const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
    const { user } = useContext(UserContext);


    //Fetching Scrums and Users on Component Mount
    useEffect(() => {
        const fetchScrums = async () => {
            try {
                const response = await axios.get('http://localhost:4000/scrums');
                setScrums(response.data);
            } catch (error) {
                console.error('Error fetching scrums:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchScrums(); // Fetch scrums when component loads
        fetchUsers();  // Fetch users when component loads
    }, []);


    //Get Details of a Specific Scrum
    const handleGetDetails = async (scrumId) => {
        try {
            const response = await axios.get(`http://localhost:4000/scrums/${scrumId}`);
            setSelectedScrum(response.data);
        } catch (error) {
            console.error('Error fetching scrum details:', error);
        }
    };

    const handleAddScrum = async (event) => {
        event.preventDefault(); //Stops the default browser behavior of refreshing the page when a form is submitted.
        try {
            // Add new Scrum
            const newScrumResponse = await axios.post('http://localhost:4000/scrums', {
                name: newScrumName,
            });

            const newScrum = newScrumResponse.data;

            // Add new Task
            await axios.post('http://localhost:4000/tasks', {
                title: newTaskTitle,
                description: newTaskDescription,
                status: newTaskStatus,
                scrumId: newScrum.id,
                assignedTo: newTaskAssignedTo,
                history: [
                    {
                        status: newTaskStatus,
                        date: new Date().toISOString().split('T')[0],
                    },
                ],
            });

            const updatedScrums = await axios.get('http://localhost:4000/scrums');
            setScrums(updatedScrums.data);
            setShowForm(false); // Hide the form after submission
            setNewScrumName('');
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskStatus('To Do');
            setNewTaskAssignedTo('');
        } catch (error) {
            console.error('Error adding scrum:', error);
        }

        /*The handleAddScrum function:

Prevents default form submission.
Sends a POST request to add a new scrum.
Adds an associated task linked to that scrum.
Fetches and updates the list of scrums after addition.
Resets the form and hides it.
Handles any errors during the process. */
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Scrum Teams</h2>
            {user?.role === 'admin' && (
                <div className="text-center mb-3">
                    <Button color="primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add New Scrum'}
                    </Button>
                    {showForm && (
                        <Card className="mt-4">
                            <CardBody>
                                <Form onSubmit={handleAddScrum}>
                                    <FormGroup>
                                        <Label>Scrum Name:</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter scrum name"
                                            value={newScrumName}
                                            onChange={(e) => setNewScrumName(e.target.value)}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Task Title:</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter task title"
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Task Description:</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter task description"
                                            value={newTaskDescription}
                                            onChange={(e) => setNewTaskDescription(e.target.value)}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Task Status:</Label>
                                        <Input
                                            type="select"
                                            value={newTaskStatus}
                                            onChange={(e) => setNewTaskStatus(e.target.value)}
                                            required
                                        >
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Assign To:</Label>
                                        <Input
                                            type="select"
                                            value={newTaskAssignedTo}
                                            onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a user</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.name} ({user.email})
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                    <Button type="submit" color="success" block>Create Scrum</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    )}
                </div>
            )}
            <Row className="mt-4">
                {scrums.map((scrum) => (
                    <Col md={4} key={scrum.id} className="mb-4">
                        <Card>
                            <CardBody>
                                <h5>{scrum.name}</h5>
                                <Button color="info" onClick={() => handleGetDetails(scrum.id)}>
                                    Get Details
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
            {selectedScrum && <ScrumDetails scrum={selectedScrum} />}
        </Container>
    );
};

export default Dashboard;
