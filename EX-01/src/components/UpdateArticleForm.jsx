import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function UpdateArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    journalistId: '',
    categoryId: '',
  });


  // Fetch to prefill a form and update an existing article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/articles/${id}`);
        setForm({
          title: response.data.title,
          content: response.data.content,
          journalistId: response.data.journalistId,
          categoryId: response.data.categoryId,
        });
      } catch (error) {
        console.error(error);
        alert('Failed to load article');
      }
    };

    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiBaseUrl}/articles/${id}`, form);
      alert('Article updated successfully');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Failed to update article');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Update Article</h3>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required /><br />
      <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required /><br />
      <input name="journalistId" value={form.journalistId} onChange={handleChange} placeholder="Journalist ID" required /><br />
      <input name="categoryId" value={form.categoryId} onChange={handleChange} placeholder="Category ID" required /><br />
      <button type="submit">Update</button>
    </form>
  );
}
