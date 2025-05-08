import React, { useState, useEffect } from 'react';
import { Form, Button, Container, ProgressBar, Badge, Placeholder } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { signupFormAtom } from '../store/signupAtom';

const options = {
  genres: ['Pop', 'Rock', 'Hip‑Hop', 'Jazz', 'Classical', 'EDM'],
  languages: ['English', 'Hindi', 'Spanish', 'French', 'Tamil'],
  artists: ['Taylor Swift', 'Arijit Singh', 'Drake', 'BTS', 'Adele']
};

const SignupStepTwo: React.FC = () => {
  const [formData, setFormData] = useAtom(signupFormAtom);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setReady(true);
  }, []);

  const toggleAll = (field: keyof typeof options) => {
    const all = options[field];
    const selected = formData[field] || [];
    setFormData({
      ...formData,
      [field]: selected.length === all.length ? [] : all
    });
  };

  const handleSelect = (field: keyof typeof options, value: string) => {
    const selected = new Set(formData[field] || []);
    selected.has(value) ? selected.delete(value) : selected.add(value);
    setFormData({ ...formData, [field]: Array.from(selected) });
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    (Object.keys(options) as Array<keyof typeof options>).forEach(field => {
      if (!((formData[field] ?? []).length > 0)) {
        newErrors[field] = `Please select at least one ${field}`;
      }
    });
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 p-0 bg-dark text-light">
      {!ready ? (
        <Placeholder as="div" animation="glow" className="w-100" style={{ maxWidth: 500 }}>
          <Placeholder xs={12} size="lg" />
          <Placeholder xs={12} />
        </Placeholder>
      ) : (
        <Form
          onSubmit={handleSubmit}
          className="p-4 border m-5 rounded shadow-sm bg-dark text-light w-100"
          style={{ maxWidth: 500 }}
          noValidate
        >
          <ProgressBar now={100} label={`Step 2 of 2`} className="mb-4" variant="danger" />

          <h3 className="mb-4 text-center">Your Preferences</h3>

          {(Object.keys(options) as Array<keyof typeof options>).map(field => (
            <Form.Group className="mb-4" key={field}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0 text-light">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-light"
                  onClick={() => toggleAll(field)}
                >
                  {formData[field]?.length === options[field].length ? 'Clear All' : 'Select All'}
                </Button>
              </div>

              <div className="border rounded p-2 mb-2 bg-dark">
                {options[field].map(opt => (
                  <Form.Check
                    key={opt}
                    type="checkbox"
                    id={`${field}-${opt}`}
                    label={opt}
                    checked={formData[field]?.includes(opt) || false}
                    onChange={() => handleSelect(field, opt)}
                    className="mb-1 text-light"
                  />
                ))}
              </div>

              {/* Chips: Selected Preferences */}
              {(formData[field] ?? []).length > 0 && (
                <div className="mb-2">
                  {(formData[field] ?? []).map(opt => (
                    <Badge pill bg="primary" className="me-2 mb-1" key={opt}>
                      {opt}{' '}
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

              {/* Error Message for Missing Selections */}
              {errors[field] && (
                <div className="text-danger small mt-1">{errors[field]}</div>
              )}
            </Form.Group>
          ))}

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/signup')} className="text-light">
              Back
            </Button>
            <Button type="submit" variant="primary" className="text-light">
              Finish
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
};

export default SignupStepTwo;