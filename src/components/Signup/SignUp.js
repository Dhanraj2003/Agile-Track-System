import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUp = () => {
    const navigate = useNavigate();

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
                await axios.post('https://agile-track-system-1.onrender.com/api/users', {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: 'employee'
                });
                alert('Signup successful!');
                navigate('/login');
            } catch (error) {
                console.error('Error signing up:', error);
                alert('Signup failed. Please try again.');
            }
        }
    });

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "400px", padding: "20px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <CardBody>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group my-3">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                className={`form-control ${formik.errors.name && formik.touched.name ? 'is-invalid' : ''}`}
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your name"
                            />
                            {formik.errors.name && formik.touched.name && (
                                <div className="text-danger">{formik.errors.name}</div>
                            )}
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className={`form-control ${formik.errors.email && formik.touched.email ? 'is-invalid' : ''}`}
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your email"
                            />
                            {formik.errors.email && formik.touched.email && (
                                <div className="text-danger">{formik.errors.email}</div>
                            )}
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                className={`form-control ${formik.errors.password && formik.touched.password ? 'is-invalid' : ''}`}
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your password"
                            />
                            {formik.errors.password && formik.touched.password && (
                                <div className="text-danger">{formik.errors.password}</div>
                            )}
                        </div>
                        <Container className="text-center mt-4">
                            <button type="submit" className="btn btn-success w-100">Sign Up</button>
                        </Container>
                    </form>
                    <p className="text-center mt-3">
                        Already have an account?{' '}
                        <button
                            className="btn btn-link"
                            onClick={() => navigate('/login')}
                        >
                            Login here
                        </button>
                    </p>
                </CardBody>
            </Card>
        </div>
    );
};

export default SignUp;
