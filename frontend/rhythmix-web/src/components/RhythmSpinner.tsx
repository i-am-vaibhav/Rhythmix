import { Spinner } from "react-bootstrap";

const RhythmSpinner = () => { 
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
        <Spinner animation="border" role="status" variant="light" aria-hidden="true" />
        <span className="visually-hidden text-light ms-2">Loading the rhythm...</span>
      </div>
  );
}

export default RhythmSpinner;