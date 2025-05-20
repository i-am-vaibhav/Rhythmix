import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Container,
  ProgressBar,
  Badge,
  Placeholder,
  Alert,
  Spinner
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '../store/signupStore';
import { useAuthStore } from '../store/authStore';

const options = {
  genres: [
    "Bollywood", "Soundtrack", "Love", "Party", "Dance", "Film", "Hip-Hop", "Rap", "PunjabiPop", "Qawwali", "Romantic", "Soft", "Rock"
  ],

  languages: [
    'Hindi', 'Bhojpuri', 'Bihari', 'Marathi', 'Punjabi', 'English'
  ],

  artists: [
    "99side", "Ali Azmat", "Arijit Singh", "Amar Jalal", "Arif Lohar", "Harshdeep Kaur", "Diljit Dosanjh", "Sia", "Greg Kurstin", "Himesh Reshammiya", "Shreya Ghoshal", "Yo Yo Honey Singh", "Hamsika Iyer", "Imtiaz Ali", "Sajid Ali", "K.K", "Kushal Grumpy", "Little Bhatia", "Mika Singh", "Mohammed Irfan", "Gajendra Verma", "Mohit Chauhan", "Neeti Mohan", "Salim Merchant", "Shekhar Ravjiani", "Paradox", "Pho", "Piyush Mishra", "Rabbi Shergill", "Rahat Fateh Ali Khan", "Raghav Chaitanya", "Shafqat Amanat Ali", "Sonu Nigam", "Meet Bros", "Ustad Nusrat Fateh Ali Khan", "Vikas Bhalla", "Aman Trikha", "Vishal Dadlani", "Wajid", "Neha Kakkar"
  ]
};


const SignupStepTwo: React.FC = () => {
  const { formData, setFormData, registerUser, resetForm } = useSignupStore();
  const [errors, setErrors] = useState<Partial<Record<keyof typeof options, string>>>({});
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { setReady(true); }, []);

  const toggleAll = (field: keyof typeof options) => {
    const all = options[field];
    const selected = formData[field] || [];
    setFormData({
      ...formData,
      [field]: selected.length === all.length ? [] : all
    });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSelect = (field: keyof typeof options, value: string) => {
    const selected = new Set(formData[field] || []);
    selected.has(value) ? selected.delete(value) : selected.add(value);
    setFormData({ ...formData, [field]: Array.from(selected) });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    (Object.keys(options) as Array<keyof typeof options>).forEach(field => {
      if (!(formData[field]?.length > 0)) {
        newErrors[field] = `Please select at least one ${field}`;
      }
    });
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    const response = await registerUser();
    setSubmitting(false);
    if (response.status == 201) {
      resetForm();
      useAuthStore.setState({
        isAuthenticated: true,
        userData: response.data.userData,
        message: '' 
      });
      navigate('/home/dashboard');
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center my-5 justify-content-center min-vh-100 bg-dark text-white px-3"
    >
      {!ready ? (
        <div
          className="p-4 rounded bg-secondary bg-opacity-10 shadow-sm w-100 animate-placeholder"
          style={{ maxWidth: 500 }}
        >
          <Placeholder as="div" animation="glow" className="w-100">
            <Placeholder xs={12} size="lg" className="mb-3 rounded" />
            <Placeholder xs={12} className="mb-2 rounded" />
          </Placeholder>
        </div>
      ) : (
        <Form
          onSubmit={handleSubmit}
          className="p-4 border border-secondary rounded-4 shadow w-100 bg-dark text-white"
          style={{ maxWidth: 500 }}
          noValidate
        >
          <ProgressBar now={100} label="Step 2 of 2" className="mb-4" variant="danger" />

          <h3 className="mb-4 text-center fw-bold fs-4">Your Preferences</h3>

          {(Object.keys(options) as Array<keyof typeof options>).map(field => (
            <Form.Group className="mb-4" key={field}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0 text-light fw-semibold">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-warning"
                  onClick={() => toggleAll(field)}
                >
                  {formData[field]?.length === options[field].length ? 'Clear All' : 'Select All'}
                </Button>
              </div>

              <div className="border d-flex flex-wrap gap-2 border-secondary rounded p-2 mb-2 bg-dark">
                {options[field].map(opt => (
                  <Form.Check
                    key={opt}
                    type="checkbox"
                    id={`${field}-${opt}`}
                    label={opt}
                    checked={formData[field]?.includes(opt) || false}
                    onChange={() => handleSelect(field, opt)}
                    className="mb-2 text-white"
                  />
                ))}
              </div>

              {/* Selected Badges */}
              {formData[field]?.length > 0 && (
                <div className="mb-2">
                  {formData[field].map(opt => (
                    <Badge
                      pill
                      bg="primary"
                      className="me-2 mb-2 align-items-center"
                      key={opt}
                    >
                      {opt}
                      <FaTrash
                        role="button"
                        className="ms-1"
                        onClick={() => handleSelect(field, opt)}
                        style={{ cursor: 'pointer' }}
                      />
                    </Badge>
                  ))}
                </div>
              )}

              {errors[field] && (
                <Alert variant="danger" className="py-1 small">
                  {errors[field]}
                </Alert>
              )}
            </Form.Group>
          ))}

          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={() => navigate('/signup')}
              className="text-light"
            >
              Back
            </Button>
            <Button type="submit" variant="primary" className="text-light" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                  Finishing...
                </>
              ) : (
                'Finish'
              )}
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
};

export default SignupStepTwo;
