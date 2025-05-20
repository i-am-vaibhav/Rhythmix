import React, { useState, useEffect, type FormEvent } from 'react';
import {
  Form,
  Button,
  FloatingLabel,
  InputGroup,
  Spinner,
  Placeholder,
  Container,
  ProgressBar
} from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaMobileAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '../store/signupStore';

const SignupStepOne: React.FC = () => {
  const { formData, setFormData } = useSignupStore();
  const [touched, setTouched] = useState<Record<keyof typeof formData, boolean>>({
    userName: false,
    email: false,
    password: false,
    mobile: false,
    genres: false,
    languages: false,
    artists: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => setReady(true), []);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.userName) errs.userName = 'Username is required';
    else if (formData.userName.length < 3) errs.userName = 'Must be at least 3 characters';
    if (!formData.email) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errs.email = 'Invalid email address';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Must be at least 6 characters';
    if (!formData.mobile) errs.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile)) errs.mobile = 'Invalid mobile number';
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
    setTouched({
      userName: true,
      email: true,
      password: true,
      mobile: true,
      genres: false,
      languages: false,
      artists: false,
    });
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

  const renderInput = (
    name: keyof typeof formData,
    type: string,
    placeholder: string,
    icon: React.ReactNode
  ) => (
    <FloatingLabel controlId={`floating-${name}`} label="" className="mb-3">
      <InputGroup hasValidation>
        <InputGroup.Text className="bg-dark text-white border-secondary">
          {icon}
        </InputGroup.Text>
        <Form.Control
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleBlur}
          isInvalid={touched[name] && !!errors[name]}
          required
          autoComplete="off"
          className="bg-dark text-white border-secondary"
        />
        <Form.Control.Feedback type="invalid">
          {errors[name]}
        </Form.Control.Feedback>
      </InputGroup>
    </FloatingLabel>
  );

  return (
    <Container
      fluid
      className="d-flex align-items-center overflow-hidden justify-content-center min-vh-100 bg-dark text-white px-3"
    >
      {!ready ? (
        <div
          className="p-4 rounded bg-secondary bg-opacity-10 shadow-sm w-100 animate-placeholder"
          style={{ maxWidth: 400 }}
        >
          <Placeholder as="div" animation="glow" className="w-100">
            <Placeholder xs={12} size="lg" className="mb-3 rounded" />
            <Placeholder xs={12} className="mb-2 rounded" />
            <Placeholder xs={6} className="rounded" />
          </Placeholder>
        </div>
      ) : (
        <Form
          onSubmit={handleSubmit}
          className="p-4 border border-secondary rounded-4 shadow w-100 bg-dark text-white"
          style={{ maxWidth: 400 }}
          noValidate
        >

          <h3 className="mb-4 text-center fw-bold fs-4">Sign Up - User Details</h3>
          <ProgressBar now={33} label="Step 1 of 2" className="mb-4" variant="danger" />

          {renderInput('userName', 'text', 'Username', <FaUser />)}
          {renderInput('email', 'email', 'Email', <FaEnvelope />)}
          {renderInput('mobile', 'tel', 'Mobile', <FaMobileAlt />)}

          {/* Password Field */}
          <FloatingLabel controlId="floating-password" label="" className="mb-3">
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-dark text-white border-secondary">
                <FaLock />
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.password && !!errors.password}
                required
                autoComplete="new-password"
                className="bg-dark text-white border-secondary"
              />
              <Button
                variant="outline-light"
                onClick={() => setShowPassword(prev => !prev)}
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </FloatingLabel>

          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <span className="text-white small">Already have an account?</span>
            <Button
              variant="link"
              onClick={() => navigate('/login')}
              className="p-0 text-warning fw-semibold text-decoration-none"
            >
              Log In
            </Button>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Processing...
              </>
            ) : (
              'Next'
            )}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default SignupStepOne;
