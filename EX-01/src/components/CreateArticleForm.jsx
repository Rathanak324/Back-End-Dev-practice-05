import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ArticleForm() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    journalistId: '',
    categoryId: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiBaseUrl}/articles`, form);
      alert('Article created successfully');
      setForm({ title: '', content: '', journalistId: '', categoryId: '' });
      navigate('/');
    } catch (error) {
      console.error(error);
      const message = error?.code === 'ERR_NETWORK'
        ? `Cannot reach the API at ${apiBaseUrl}. Make sure the backend is running.`
        : 'Failed to create article';
      alert(message);
    }
  };

  return (

    <div>
      {/* Navigation Links */}
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>📄 View Articles</Link>
        <Link to="/add"> ➕ Add Article</Link>
      </nav>

      <h2>Articles</h2>
      <form onSubmit={handleSubmit}>
        <h3>Add New Article</h3>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required /><br />
        <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required /><br />
        <input name="journalistId" value={form.journalistId} onChange={handleChange} placeholder="Journalist ID" required /><br />
        <input name="categoryId" value={form.categoryId} onChange={handleChange} placeholder="Category ID" required /><br />
        <button type="submit">Add</button>
      </form>

    </div>
  );
}
