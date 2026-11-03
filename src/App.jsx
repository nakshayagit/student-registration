import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const API = 'http://localhost:3000/student';

  const emptyForm = {
    name: '',
    course: '',
    phone: '',
    qualification: ''
  };

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // Get all students
  const loadStudents = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load students');
      }

      setStudents(data);
    } catch (error) {
      console.error(error);
      alert('Cannot load students. Check the backend server.');
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)       
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Save failed');
      }

      alert(data.message || 'Saved successfully');
      setForm(emptyForm);
      setEditId(null);
      await loadStudents();
    } catch (error) {
      console.error(error);
      alert('Save failed: ' + error.message);
    }
  };

  // Edit button
  const handleEdit = (student) => {
    setForm({
      name: student.name || '',
      course: student.course || '',
      phone: String(student.phone || ''),
      qualification: student.qualification || ''
    });

    setEditId(student.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete button
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Delete failed');
      }

      alert(data.message || 'Deleted successfully');

      if (editId === id) {
        setEditId(null);
        setForm(emptyForm);
      }

      await loadStudents();
    } catch (error) {
      console.error(error);
      alert('Delete failed: ' + error.message);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  return (
    <div style={{ padding: '25px', fontFamily: 'Arial' }}>
      <h2>Student Registration Form</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        {' '}

        <input
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          required
        />
        {' '}

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        {' '}

        <input
          name="qualification"
          placeholder="Qualification"
          value={form.qualification}
          onChange={handleChange}
          required
        />
        {' '}

        <button type="submit">
          {editId ? 'Update Student' : 'Submit '}
        </button>

        {editId && (
          <button type="button" onClick={cancelEdit}> 
            Cancel
          </button>
        )}
      </form>

      <h2>Student Details</h2>  

      <table
        border="1"
        cellPadding="10"
        style={{ borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Course</th>
            <th>Phone</th>
            <th>Qualification</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.course}</td>
              <td>{student.phone}</td>
              <td>{student.qualification}</td>
              <td>
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>
                {' '}

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {students.length === 0 && (
            <tr>
              <td colSpan="6">No student records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App; 