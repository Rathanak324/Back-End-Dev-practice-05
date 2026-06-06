import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  // Fetch all articles when component mounts
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    // Fetch articles from the API
    try {
      const res = await axios.get(`${apiBaseUrl}/articles`);
      setArticles(res.data);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    }
  };

  const deleteArticle = async (id) => {
    // Delete an article by ID
    try {
      await axios.delete(`${apiBaseUrl}/articles/${id}`);
      setArticles((current) => current.filter(article => article.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
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
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <strong>{article.title}</strong> <br />
            <small>By Journalist #{article.journalistId} | Category #{article.categoryId}</small><br />
            <button onClick={() => deleteArticle(article.id)}>Delete</button>
            <button onClick={() => {
              navigate(`/update/${article.id}`);
            }}>Update</button>
            <button onClick={() => {
              // Navigate to view article details with article ID /articles/${article.id}
              navigate(`/articles/${article.id}`);
            }}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}