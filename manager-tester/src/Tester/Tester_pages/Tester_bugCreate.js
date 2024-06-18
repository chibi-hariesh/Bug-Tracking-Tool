import React, { useState } from 'react';
import { Container, Card, CardContent, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import Navbar from './Tester_navbar';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import './Tester_bugCreate.css';
import Cookies from 'js-cookie';

const Tester_bugCreate = () => {
  const [bugName, setBugName] = useState('');
  const [summary, setSummary] = useState('');
  const [feature, setFeature] = useState('');
  const [severity, setSeverity] = useState('');
  const [steps, setSteps] = useState('');
  const navigate = useNavigate();

  const handleCreateBug = async () => {
    try {
      // Check if any field is empty
      if (!summary || !feature || !severity || !steps) {
        Swal.fire({
          title: 'All fields are required!',
          text: 'Please fill in all fields before creating the bug.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      // Retrieve tester_id and request_id from cookies
      const tester_id = Cookies.get('tester_id');
      const request_id = Cookies.get('request_id');

      // Confirmation dialog before creating the bug
      const result = await Swal.fire({
        title: 'Confirm Bug Creation',
        text: 'Are you sure you want to create this bug?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        // Send bug creation data to the server
        const response = await fetch('http://localhost:4000/api/v1/tester/create-bugs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary,
            feature,
            severity,
            steps,
            tester_id,
            request_id,
            bugName,
            status: 'Under Triage' // Set default status
          })
        });

        if (response.ok) {
          // Bug creation successful, navigate back to the previous page
          navigate(-1);
        } else {
          // Error occurred while creating bug
          throw new Error('Failed to create bug');
        }
      }
    } catch (error) {
      console.error('Error creating bug:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to create bug. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div>
      <Navbar color="black" />
      <Container className="page-container">
        <Card className="bug-creation-card">
          <CardContent>
            <h2>Create Bug</h2>
            <form>
            <TextField
                id="bugName"
                label="Bug Name"
                value={bugName}
                onChange={(e) => setBugName(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Feature/Workflow"
                multiline
                rows={4}
                value={feature}
                onChange={(e) => setFeature(e.target.value)}
                fullWidth
                required
              />
              <FormControl fullWidth required>
                <InputLabel id="severity-label">Severity</InputLabel>
                <Select
                  labelId="severity-label"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">Select Severity</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Steps to Reproduce"
                multiline
                rows={4}
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                fullWidth
                required
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateBug}
                fullWidth
                style={{ marginBottom: '10px' }}
              >
                Create Bug
              </Button>
              <Link to="/Tester_details">
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                >
                  Cancel
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Tester_bugCreate;
