import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUp = () => {
    const history = useHistory();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string()
                .matches(/@/, 'Email must contain @')
                .required('Email is required')
                .email('Invalid email format'),
            password: Yup.string().required('Password is required')
        }),
        onSubmit: async (values) => {
            try {
                await axios.post('http://localhost:4000/users', {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: 'employee'
                });
                alert('signup successful');
                history.push('/login');
            } catch (error) {
                console.error('Error signing up:', error);
            }
        }
    });

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "400px", padding: "20px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <CardBody>
                    <h2 className="text-center">Sign Up</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group my-4">
                            <label>Name:</label>
                            <input
                                type="text"
                                className={`form-control ${formik.errors.name ? 'is-invalid' : ''}`}
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                placeholder="Enter your name"
                            />
                            {formik.errors.name && <p className="text-danger">{formik.errors.name}</p>}
                        </div>
                        <div className="form-group my-4">
                            <label>Email:</label>
                            <input
                                type="email"
                                className={`form-control ${formik.errors.email ? 'is-invalid' : ''}`}
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                placeholder="Enter your email"
                            />
                            {formik.errors.email && <p className="text-danger">{formik.errors.email}</p>}
                        </div>
                        <div className="form-group my-4">
                            <label>Password:</label>
                            <input
                                type="password"
                                className={`form-control ${formik.errors.password ? 'is-invalid' : ''}`}
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                placeholder="Enter your password"
                            />
                            {formik.errors.password && <p className="text-danger">{formik.errors.password}</p>}
                        </div>
                        <Container className="text-center mt-4">
                            <button type="submit" className="btn btn-success">Sign Up</button>
                        </Container>
                    </form>
                    <p className="text-center mt-3">
                        Already have an account? <button className="btn btn-link" onClick={() => history.push('/login')}>Login here</button>
                    </p>
                </CardBody>
            </Card>
        </div>
    );
};

export default SignUp;
