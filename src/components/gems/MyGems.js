import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './MyGems.css';

function MyGems() {
  const navigate = useNavigate();

  const [gems, setGems] = useState([]);
  const [filteredGems, setFilteredGems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch gems with useCallback
  const fetchMyGems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      console.log('🔷 Fetching gems with token:', token ? 'EXISTS' : 'MISSING');
      
      const response = await fetch('http://localhost:5000/api/gems/my-gems', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('🔷 API Response:', data);
      
      if (data.success) {
        setGems(data.data);
        console.log('🔷 Gems loaded successfully:', data.data.length);
      } else {
        setError(data.message || 'Failed to load gems');
        console.error('🔷 API returned error:', data.message);
      }
    } catch (err) {
      console.error('🔷 Fetch error:', err);
      setError('Failed to load gems. Please try again.');
    }
    setLoading(false);
  }, []);

  // Fetch gems on component mount
  useEffect(() => {
    console.log('🔷 MyGems component mounted');
    fetchMyGems();
  }, [fetchMyGems]);

  // Filter and sort gems
  useEffect(() => {
    console.log('🔷 Filtering gems. Total gems:', gems.length);
    let filtered = [...gems];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(gem =>
        gem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gem._id.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(gem => gem.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(gem => gem.gemType === typeFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      default:
        break;
    }

    setFilteredGems(filtered);
    console.log('🔷 Filtered gems:', filtered.length);
  }, [gems, searchTerm, statusFilter, typeFilter, sortBy]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gem?')) {
      try {
        await api.delete(`/gems/${id}`);
        setGems(gems.filter(gem => gem._id !== id));
        alert('Gem deleted successfully!');
      } catch (err) {
        alert('Failed to delete gem: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending', class: 'status-pending' },
      approved: { text: 'Active', class: 'status-active' },
      rejected: { text: 'Rejected', class: 'status-rejected' }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="my-gems-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-icon">💎</span>
            <div>
              <div className="brand-name">Gemstone Emporium</div>
              <div className="brand-subtitle">Seller Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate('/dashboard')} className="nav-item">
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <button className="nav-item active">
            <span className="nav-icon">💎</span>
            My Listings
          </button>
          <button onClick={() => navigate('/my-portfolio')} className="nav-item">
            <span className="nav-icon">🖼️</span>
            My Gem Gallery
          </button>
          <button onClick={() => navigate('/auctions')} className="nav-item">
            <span className="nav-icon">🔨</span>
            Auctions
          </button>
          <button onClick={() => navigate('/messages')} className="nav-item">
            <span className="nav-icon">✉️</span>
            Messages
          </button>
          <button onClick={() => navigate('/profile')} className="nav-item">
            <span className="nav-icon">👤</span>
            Profile
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => navigate('/storefront')} className="storefront-btn">
            View Storefront
          </button>
          <button onClick={() => navigate('/settings')} className="settings-btn">
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>My Gem Listings</h1>
          <button onClick={() => navigate('/add-gem')} className="add-gem-btn">
            + Add New Gem
          </button>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Status: All</option>
              <option value="pending">Pending</option>
              <option value="approved">Active</option>
              <option value="rejected">Rejected</option>
            </select>

            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">Type: All</option>
              <option value="Diamond">Diamond</option>
              <option value="Ruby">Ruby</option>
              <option value="Sapphire">Sapphire</option>
              <option value="Emerald">Emerald</option>
              <option value="Topaz">Topaz</option>
              <option value="Amethyst">Amethyst</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Sort By: Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* Listings Table */}
        <div className="listings-table">
          <div className="table-header">
            <div className="col-gem">GEM DETAILS</div>
            <div className="col-id">LISTING ID</div>
            <div className="col-date">DATE LISTED</div>
            <div className="col-price">PRICE</div>
            <div className="col-status">STATUS</div>
            <div className="col-actions">ACTIONS</div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner">💎</div>
              <p>Loading your gems...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={fetchMyGems} className="retry-btn">Try Again</button>
            </div>
          ) : filteredGems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💎</div>
              <h3>No gems found</h3>
              <p>
                {gems.length === 0 
                  ? "Start by adding your first gem listing" 
                  : "No gems match your current filters"}
              </p>
              <button onClick={() => navigate('/add-gem')} className="empty-btn">
                + Add Your First Gem
              </button>
            </div>
          ) : (
            filteredGems.map((gem) => {
              const statusBadge = getStatusBadge(gem.status);
              return (
                <div key={gem._id} className="table-row">
                  <div className="col-gem">
                    <div className="gem-image">
                      {gem.images && gem.images[0] ? (
                        <img src={gem.images[0].url} alt={gem.title} />
                      ) : (
                        <div className="no-image">💎</div>
                      )}
                    </div>
                    <div className="gem-info">
                      <div className="gem-title">{gem.title}</div>
                      <div className="gem-subtitle">
                        {gem.gemType}, {gem.carat}ct
                      </div>
                    </div>
                  </div>

                  <div className="col-id">#{gem._id.slice(-6).toUpperCase()}</div>

                  <div className="col-date">
                    {new Date(gem.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </div>

                  <div className="col-price">
                    {gem.price ? `$${gem.price.toLocaleString()}` : '-'}
                  </div>

                  <div className="col-status">
                    <span className={`status-badge ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                    {gem.status === 'rejected' && gem.rejectionReason && (
                      <button 
                        className="info-icon"
                        title={gem.rejectionReason}
                      >
                        ℹ️
                      </button>
                    )}
                  </div>

                  <div className="col-actions">
                    <button
                      className="action-btn view-btn"
                      onClick={() => navigate(`/gems/${gem._id}`)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => navigate(`/edit-gem/${gem._id}`)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(gem._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {filteredGems.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing 1-{filteredGems.length} of {gems.length}
            </div>
            <div className="pagination-controls">
              <button className="page-btn">Previous</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <span>...</span>
              <button className="page-btn">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyGems;
