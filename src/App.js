import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, NavLink, BrowserRouter, useNavigate } from 'react-router-dom';

// Context for biodata
const BiodataContext = createContext();

function BiodataProvider({ children }) {
  const [biodata, setBiodata] = useState({
    name: 'Shruti',
    age: 14,
    grade: '10',
    roll: '2315022',
    email: 'shruti@example.com',
    profilePic: 'https://via.placeholder.com/150',
    about: 'This is a short about me paragraph.',
  });

  const updateBiodata = (newData) => {
    setBiodata(prev => ({ ...prev, ...newData }));
  };

  return (
    <BiodataContext.Provider value={{ biodata, updateBiodata }}>
      {children}
    </BiodataContext.Provider>
  );
}

// Home Page
function Home() {
  const { biodata } = useContext(BiodataContext);
  return (
    <div className="page">
      <h1>Home - Biodata</h1>
      <table className="biodata-table" border="1" cellPadding="5" cellSpacing="0">
        <tbody>
          <tr><th>Name</th><td>{biodata.name}</td></tr>
          <tr><th>Age</th><td>{biodata.age}</td></tr>
          <tr><th>Grade</th><td>{biodata.grade}</td></tr>
          <tr><th>Roll</th><td>{biodata.roll}</td></tr>
          <tr><th>Email</th><td>{biodata.email}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// Profile Page
function Profile() {
  const { biodata } = useContext(BiodataContext);
  return (
    <div className="page">
      <h1>Profile</h1>
      <div className="profile-card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <img src={biodata.profilePic} alt="Profile" style={{ width: 150, height: 150, borderRadius: 8, objectFit: 'cover' }} />
        <div>
          <h2>{biodata.name}</h2>
          <p>{biodata.about}</p>
        </div>
      </div>
    </div>
  );
}

// Utility to validate email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Utility to validate URL
const validateURL = (url) => {
  try {
    if (!url) return true; // empty allowed
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Edit Form Page with validation
function EditForm() {
  const { biodata, updateBiodata } = useContext(BiodataContext);
  const [form, setForm] = useState(biodata);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined })); // clear error on change
  }

  function validate() {
    const newErrors = {};

    if (!form.name || form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!form.age || isNaN(form.age) || form.age < 1 || form.age > 120) {
      newErrors.age = 'Age must be a number between 1 and 120';
    }

    // Grade must be at least 2 characters and not just digits 1 character like '1'
    if (!form.grade || form.grade.trim().length < 2) {
      newErrors.grade = 'Grade must be at least 2 characters (e.g., "10", "11th")';
    }

    if (!form.roll || form.roll.trim() === '') {
      newErrors.roll = 'Roll is required';
    }

    if (!form.email || !validateEmail(form.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (form.profilePic && !validateURL(form.profilePic)) {
      newErrors.profilePic = 'Profile picture must be a valid URL';
    }

    if (form.about && form.about.length > 300) {
      newErrors.about = 'About must be less than 300 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    updateBiodata({ ...form, age: Number(form.age) });
    navigate('/');
  }

  return (
    <div className="page">
      <h1>Edit Biodata</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: 400 }}>
        <label>
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
        </label>

        <label>
          Age
          <input
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
          />
          {errors.age && <div style={{ color: 'red' }}>{errors.age}</div>}
        </label>

        <label>
          Grade
          <input
            name="grade"
            value={form.grade}
            onChange={handleChange}
            required
            placeholder="e.g. 10, 11th"
          />
          {errors.grade && <div style={{ color: 'red' }}>{errors.grade}</div>}
        </label>

        <label>
          Roll
          <input
            name="roll"
            value={form.roll}
            onChange={handleChange}
            required
          />
          {errors.roll && <div style={{ color: 'red' }}>{errors.roll}</div>}
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        </label>

        <label>
          Profile Picture URL
          <input
            name="profilePic"
            value={form.profilePic}
            onChange={handleChange}
          />
          {errors.profilePic && <div style={{ color: 'red' }}>{errors.profilePic}</div>}
        </label>

        <label>
          About
          <textarea
            name="about"
            value={form.about}
            onChange={handleChange}
            rows={4}
          />
          {errors.about && <div style={{ color: 'red' }}>{errors.about}</div>}
        </label>

        <button
          type="submit"
          style={{
            padding: '10px 15px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#111827',
            color: 'white',
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
}

// Navigation Bar
function Navigation() {
  return (
    <nav style={{ display: 'flex', gap: 20, padding: 15, backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
      <NavLink to="/" end style={({ isActive }) => ({ fontWeight: 'bold', color: isActive ? 'blue' : 'black', textDecoration: 'none' })}>Home</NavLink>
      <NavLink to="/profile" style={({ isActive }) => ({ fontWeight: 'bold', color: isActive ? 'blue' : 'black', textDecoration: 'none' })}>Profile</NavLink>
      <NavLink to="/edit" style={({ isActive }) => ({ fontWeight: 'bold', color: isActive ? 'blue' : 'black', textDecoration: 'none' })}>Edit</NavLink>
    </nav>
  );
}

// Main App Component
export default function App() {
  return (
    <BiodataProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit" element={<EditForm />} />
        </Routes>
      </BrowserRouter>
    </BiodataProvider>
  );
}
