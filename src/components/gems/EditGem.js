import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './AddGem.css'; // Reuse the same styles

function EditGem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gemType: 'Diamond',
    carat: '',
    cut: 'Round',
    color: '',
    clarity: 'FL',
    origin: '',
    listingType: 'portfolio',
    price: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchGemData();
  }, [id]);

  const fetchGemData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/gems/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const gem = data.data;
        setFormData({
          title: gem.title,
          description: gem.description,
          gemType: gem.gemType,
          carat: gem.carat,
          cut: gem.cut,
          color: gem.color,
          clarity: gem.clarity || 'FL',
          origin: gem.origin,
          listingType: gem.listingType,
          price: gem.price || ''
        });
      } else {
        setError('Gem not found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load gem data');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title || !formData.description || !formData.carat || !formData.color || !formData.origin) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.listingType === 'fixed-price' && !formData.price) {
      setError('Please enter a price for fixed-price listing');
      return;
    }

    setSubmitting(true);

    try {
      await api.put(`/gems/${id}`, formData);
      setSuccess('Gem updated successfully!');
      setTimeout(() => {
        navigate('/my-gems');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update gem');
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="add-gem-wrapper">
        <div className="add-gem-container">
          <div className="loading-state">
            <div className="spinner">💎</div>
            <p>Loading gem data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-gem-wrapper">
      <div className="add-gem-container">
        <div className="add-gem-header">
          <h1>Edit Gem</h1>
          <p>Update your gemstone information</p>
        </div>

        {error && <div className="error-alert">{error}</div>}
        {success && <div className="success-alert">{success}</div>}

        <div className="add-gem-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label>Gem Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Flawless Burmese Ruby"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your gemstone in detail..."
                  rows="5"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Gem Type *</label>
                <select name="gemType" value={formData.gemType} onChange={handleChange}>
                  <option value="Diamond">Diamond</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Sapphire">Sapphire</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Topaz">Topaz</option>
                  <option value="Amethyst">Amethyst</option>
                  <option value="Opal">Opal</option>
                  <option value="Pearl">Pearl</option>
                  <option value="Jade">Jade</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Carat Weight *</label>
                <input
                  type="number"
                  name="carat"
                  value={formData.carat}
                  onChange={handleChange}
                  placeholder="e.g., 5.5"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cut *</label>
                <select name="cut" value={formData.cut} onChange={handleChange}>
                  <option value="Round">Round</option>
                  <option value="Princess">Princess</option>
                  <option value="Oval">Oval</option>
                  <option value="Emerald">Emerald</option>
                  <option value="Cushion">Cushion</option>
                  <option value="Pear">Pear</option>
                  <option value="Marquise">Marquise</option>
                  <option value="Radiant">Radiant</option>
                  <option value="Asscher">Asscher</option>
                  <option value="Heart">Heart</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Color *</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g., Deep Red, Blue, Clear"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Clarity</label>
                <select name="clarity" value={formData.clarity} onChange={handleChange}>
                  <option value="FL">FL (Flawless)</option>
                  <option value="IF">IF (Internally Flawless)</option>
                  <option value="VVS1">VVS1 (Very Very Slightly Included 1)</option>
                  <option value="VVS2">VVS2 (Very Very Slightly Included 2)</option>
                  <option value="VS1">VS1 (Very Slightly Included 1)</option>
                  <option value="VS2">VS2 (Very Slightly Included 2)</option>
                  <option value="SI1">SI1 (Slightly Included 1)</option>
                  <option value="SI2">SI2 (Slightly Included 2)</option>
                  <option value="I1">I1 (Included 1)</option>
                  <option value="I2">I2 (Included 2)</option>
                  <option value="I3">I3 (Included 3)</option>
                  <option value="N/A">N/A</option>
                </select>
              </div>

              <div className="form-group">
                <label>Origin *</label>
                <input
                  type="text"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  placeholder="e.g., Burma, Sri Lanka, Colombia"
                  required
                />
              </div>
            </div>
          </div>

          {/* Listing Type */}
          <div className="form-section">
            <h2>Listing Type</h2>
            
            <div className="listing-type-options">
              <label className={`listing-option ${formData.listingType === 'portfolio' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="listingType"
                  value="portfolio"
                  checked={formData.listingType === 'portfolio'}
                  onChange={handleChange}
                />
                <div className="option-content">
                  <div className="option-icon">📁</div>
                  <div className="option-title">Portfolio Only</div>
                  <div className="option-description">Display in your collection</div>
                </div>
              </label>

              <label className={`listing-option ${formData.listingType === 'fixed-price' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="listingType"
                  value="fixed-price"
                  checked={formData.listingType === 'fixed-price'}
                  onChange={handleChange}
                />
                <div className="option-content">
                  <div className="option-icon">💰</div>
                  <div className="option-title">Fixed Price</div>
                  <div className="option-description">List with a set price</div>
                </div>
              </label>

              <label className={`listing-option ${formData.listingType === 'auction' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="listingType"
                  value="auction"
                  checked={formData.listingType === 'auction'}
                  onChange={handleChange}
                />
                <div className="option-content">
                  <div className="option-icon">🏆</div>
                  <div className="option-title">Auction</div>
                  <div className="option-description">Let buyers bid</div>
                </div>
              </label>
            </div>

            {formData.listingType === 'fixed-price' && (
              <div className="form-group">
                <label>Price (USD) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 25000"
                  min="0"
                  required
                />
              </div>
            )}
          </div>

          {/* Note about images */}
          <div className="form-section">
            <div className="info-note">
              <strong>Note:</strong> To update images or certificates, please delete this listing and create a new one.
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/my-gems')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Updating...' : '✓ Update Gem'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditGem;