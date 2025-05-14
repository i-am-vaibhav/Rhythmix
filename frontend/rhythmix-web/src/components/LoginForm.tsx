import React, { useState, useEffect, type FormEvent } from 'react';
import {
  Form,
  Button,
  FloatingLabel,
  InputGroup,
  Spinner,
  Placeholder,
  Container
} from 'react-bootstrap';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ username: false, password: false });
  const [ready, setReady] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setReady(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const errs: { username?: string; password?: string } = {};
    if (!formData.username) errs.username = 'Username is required';
    if (!formData.password) errs.password = 'Password is required';
    return errs;
  };

  const errors = validate();
  const isValid = !errors.username && !errors.password;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    setError('');
    if (!isValid) return;

    setLoading(true);
    await new Promise(res => setTimeout(res, 300));

    if (formData.username !='' && formData.password != '') {
      const success = await login({ userName: formData.username, password: formData.password });
      if(success){
        setLoading(false);
        navigate('/home/dashboard');
      }else{
        setLoading(false);
      }
    } else {
      setError('Invalid username or password.');
    }
    setLoading(false);
  };

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
          role="form"
        >
          <h3 className="mb-4 text-center fw-bold fs-4">Login</h3>

          {error && (
            <div className="alert alert-danger text-danger text-center mb-3 fade-in-slide" role="alert">
              {error}
            </div>
          )}

          <FloatingLabel controlId="floatingUsername" label="" className="mb-3">
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-dark text-white border-secondary">
                <FaUser />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="username"
                isInvalid={touched.username && !!errors.username}
                aria-describedby="usernameFeedback"
                required
                className="bg-dark text-white border-secondary"
              />
              <Form.Control.Feedback type="invalid" id="usernameFeedback">
                {errors.username}
              </Form.Control.Feedback>
            </InputGroup>
          </FloatingLabel>

          <FloatingLabel controlId="floatingPassword" label="" className="mb-3">
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-dark text-white border-secondary">
                <FaLock />
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
                isInvalid={touched.password && !!errors.password}
                required
                className="bg-dark text-white border-secondary"
              />
              <Button
                variant="outline-light"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </FloatingLabel>

          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <span className="text-white small">Don't have an account?</span>
            <Button
              variant="link"
              onClick={() => navigate("/signup")}
              className="p-0 text-warning fw-semibold text-decoration-none"
            >
              Register Now!
            </Button>
          </div>

          <Button variant="primary" type="submit" className="w-100 fw-semibold" disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default LoginForm;