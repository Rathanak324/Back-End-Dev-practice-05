import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilterByJournalist() {
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [selectedJournalist, setSelectedJournalist] = useState('');

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchArticles();
    fetchJournalists();
  }, []);

  const fetchArticles = async () => {
    // Fetch articles from the API
    try {
      const res = await axios.get('http://localhost:5000/articles');
      setAllArticles(res.data);
      setArticles(res.data);

      // Derive journalists from articles if the /journalists endpoint is not available
      if (!journalists || journalists.length === 0) {
        const derived = Array.from(
          new Map(res.data.map(a => [String(a.journalistId), { id: String(a.journalistId), name: a.journalistName || (a.journalist && a.journalist.name) || `Journalist ${a.journalistId}` }]))
            .values()
        );
        setJournalists(derived);
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

        <button
          onClick={() => {
            try {
              if (selectedJournalist) {
                const filtered = allArticles.filter(a => String(a.journalistId) === String(selectedJournalist));
                setArticles(filtered);
              } else {
                setArticles(allArticles);
              }
            } catch (err) {
              console.error('Failed to apply journalist filter (client-side):', err);
            }
          }}
        >Apply Filters</button>
        <button
          onClick={() => {
            setSelectedJournalist('');
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