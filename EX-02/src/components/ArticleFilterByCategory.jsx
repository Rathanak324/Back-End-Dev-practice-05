import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilterByCategory() {
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    // Fetch articles from the API
    try {
      const res = await axios.get('http://localhost:5000/articles');
      setAllArticles(res.data);
      setArticles(res.data);

      // Derive categories from articles if the /categories endpoint is not available
      if (!categories || categories.length === 0) {
        const derived = Array.from(
          new Map(res.data.map(a => [String(a.categoryId), { id: String(a.categoryId), name: a.categoryName || (a.category && a.category.name) || `Category ${a.categoryId}` }]))
            .values()
        );
        setCategories(derived);
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    }
  };

  const fetchCategories = async () => {
    // Fetch categories from the API
    try {
      const res = await axios.get('http://localhost:5000/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }

  return (
    <div>
      <h2>Articles</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select id="categoryFilter" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name || `Category ${c.id}`}</option>
          ))}
        </select>

        <button
          onClick={() => {
            try {
              if (selectedCategory) {
                const filtered = allArticles.filter(a => String(a.categoryId) === String(selectedCategory));
                setArticles(filtered);
              } else {
                setArticles(allArticles);
              }
            } catch (err) {
              console.error('Failed to apply category filter (client-side):', err);
            }
          }}
        >Apply Filters</button>
        <button
          onClick={() => {
            setSelectedCategory('');
            setArticles(allArticles);
          }}
        >Reset Filters</button>
      </div>

      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <strong>{article.title}</strong> <br />
            <small>By Journalist #{article.journalistId} | Category #{article.categoryId}</small><br />
            <button disabled>Delete</button>
            <button disabled>Update</button>
            <button disabled>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}