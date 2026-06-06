import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilter() {
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedJournalist, setSelectedJournalist] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  // Fetch all articles when component mounts
  useEffect(() => {
    fetchArticles();
    fetchJournalists();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    // Fetch articles from the API
    try {
      const res = await axios.get('http://localhost:5000/articles');
      setAllArticles(res.data);
      setArticles(res.data);

      // If the API doesn't provide separate /journalists or /categories endpoints,
      // derive option lists from the articles we've fetched so the selects work.
      if (!journalists || journalists.length === 0) {
        const derived = Array.from(
          new Map(res.data.map(a => [String(a.journalistId), { id: String(a.journalistId), name: a.journalistName || (a.journalist && a.journalist.name) || `Journalist ${a.journalistId}` }]))
            .values()
        );
        setJournalists(derived);
      }

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

  const fetchJournalists = async () => {
    // Fetch journalists from the API
    try {
      const res = await axios.get('http://localhost:5000/journalists');
      setJournalists(res.data);
    } catch (err) {
      console.error('Failed to fetch journalists:', err);
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
        <label htmlFor="journalistFilter">Filter by Journalist:</label>
        <select id="journalistFilter" value={selectedJournalist} onChange={e => setSelectedJournalist(e.target.value)}>
          <option value="">All Journalists</option>
          {journalists.map(j => (
            <option key={j.id} value={j.id}>{j.name || `Journalist ${j.id}`}</option>
          ))}
        </select>

        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select id="categoryFilter" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name || `Category ${c.id}`}</option>
          ))}
        </select>

        <button
          onClick={() => {
            // Client-side filtering fallback: filter the already-fetched `allArticles`
            try {
              let filtered = allArticles;
              if (selectedJournalist) {
                filtered = filtered.filter(a => String(a.journalistId) === String(selectedJournalist));
              }
              if (selectedCategory) {
                filtered = filtered.filter(a => String(a.categoryId) === String(selectedCategory));
              }
              setArticles(filtered);
            } catch (err) {
              console.error('Failed to apply filters (client-side):', err);
            }
          }}
        >Apply Filters</button>
        <button
          onClick={() => {
            setSelectedJournalist('');
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