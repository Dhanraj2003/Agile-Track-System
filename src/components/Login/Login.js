import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Card, CardBody, Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .matches(/@/, 'Email must contain @')
                .required('Email is required')
                .email('Invalid email format'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('https://agile-track-system-1.onrender.com/api/auth/login', {
                    email: values.email,
                    password: values.password
                });

                if (response.data.success) {
                    const user = response.data.user;
                    login(user);
                    navigate(user.role === 'admin' ? '/' : '/profiles');
                } else {
                    alert(response.data.message || 'Invalid email or password');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('Failed to login. Please try again later.');
            }
        }
    });

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "400px", padding: "20px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <CardBody>
                    <h2 className="text-center">Login</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${formik.errors.email ? 'is-invalid' : ''}`}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                placeholder="Enter your email"
                            />
                            {formik.errors.email && <p className="text-danger">{formik.errors.email}</p>}
                        </div>
                        <div className="form-group mt-3">
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                className={`form-control ${formik.errors.password ? 'is-invalid' : ''}`}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                placeholder="Enter your password"
                            />
                            {formik.errors.password && <p className="text-danger">{formik.errors.password}</p>}
                        </div>
                        <Container className="text-center mt-4">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </Container>
                    </form>
                    <p className="text-center mt-3">
                        Don't have an account? 
                        <button
                            className="btn btn-link"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </p>
                </CardBody>
            </Card>
        </div>
    );
};

export default Login;
