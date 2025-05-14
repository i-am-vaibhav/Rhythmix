import React, { useState, useEffect, type FormEvent } from 'react';
import { Form, Button, FloatingLabel, InputGroup, Spinner, Placeholder, Container, ProgressBar } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaMobileAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '../store/signupStore';

const SignupStepOne: React.FC = () => {
  const {formData, setFormData} = useSignupStore();
  const [touched, setTouched] = useState({ userName: false, email: false, password: false, mobile: false });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setReady(true); }, []);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.userName) errs.userName = 'Username is required';
    else if (formData.userName.length < 3) errs.username = 'Username must be at least 3 characters';
    if (!formData.email) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errs.email = 'Invalid email address';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!formData.mobile) errs.mobile = 'Mobile number is required';
    else if (!/^\d{10,10}$/.test(formData.mobile)) errs.mobile = 'Invalid mobile number';
    return errs;
  };

  useEffect(() => {
    if (Object.values(touched).some(Boolean)) setErrors(validate());
  }, [formData, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ userName: true, email: true, password: true, mobile: true });
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }
    setLoading(true);
    await new Promise(res => setTimeout(res, 1000));
    setLoading(false);
    navigate('/signup-step-two');
  };

  const renderInput = (label: string, name: string, type: string, icon: React.ReactNode) => (
    <FloatingLabel controlId={`floating${name.charAt(0).toUpperCase() + name.slice(1)}`} label="" className="mb-3">
      <InputGroup hasValidation>
        <InputGroup.Text className="bg-dark text-white border-secondary">
          {icon}
        </InputGroup.Text>
        <Form.Control
          type={type}
          name={name}
          placeholder={label}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete={name}
          isInvalid={touched[name as keyof typeof touched] && !!errors[name as keyof typeof errors]}
          required
          className="bg-dark text-white border-secondary"
        />
        <Form.Control.Feedback type="invalid">{errors[name as keyof typeof errors]}</Form.Control.Feedback>
      </InputGroup>
    </FloatingLabel>
  );

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-dark text-light p-4">
      {!ready ? (
        <Placeholder as="div" animation="glow" className="w-100" style={{ maxWidth: 400 }}>
          <Placeholder xs={12} size="lg" />
          <Placeholder xs={12} />
          <Placeholder xs={6} />
        </Placeholder>
      ) : (
        <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-dark w-100" style={{ maxWidth: 400 }} noValidate>
          {/* Progress Bar */}
          <ProgressBar now={50} label="Step 1 of 2" className="mb-4" aria-label="Signup progress" variant="danger" />

          <h3 className="mb-4 text-center text-light">User Details</h3>

          {/* Error Feedback */}
          {Object.keys(errors).map((field) =>
            touched[field as keyof typeof touched] && errors[field as keyof typeof errors] ? (
              <div className="alert alert-danger" role="alert" key={field}>
                {errors[field as keyof typeof errors]}
              </div>
            ) : null
          )}

          {/* Input Fields */}
          {renderInput('Username', 'userName', 'text', <FaUser />)}
          {renderInput('Email', 'email', 'email', <FaEnvelope />)}
          {renderInput('Mobile', 'mobile', 'tel', <FaMobileAlt />)}

          {/* Password Input */}
          <FloatingLabel controlId="floatingPassword" label="" className="mb-3">
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-dark text-white border-secondary"><FaLock /></InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
                isInvalid={touched.password && !!errors.password}
                required
                className="bg-dark text-white border-secondary"
              />
              <Button
                variant="outline-light"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </FloatingLabel>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="link" onClick={() => navigate('/login')} className="p-0 text-warning">
              Already have an account? Log in
            </Button>
          </div>

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="w-100 py-2" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" role="status" aria-hidden="true" /> Next...
              </>
            ) : 'Next'}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default SignupStepOne;