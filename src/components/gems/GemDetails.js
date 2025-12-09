import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import './GemDetails.css';

function GemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gem, setGem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchGemDetails();
  }, [id]);

  const fetchGemDetails = async () => {
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
        setGem(data.data);
      } else {
        setError('Gem not found');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load gem details');
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pending Approval', class: 'badge-pending', icon: '⏳' },
      approved: { text: 'Active', class: 'badge-active', icon: '✅' },
      rejected: { text: 'Rejected', class: 'badge-rejected', icon: '❌' }
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="gem-details-loading">
        <div className="spinner">💎</div>
        <p>Loading gem details...</p>
      </div>
    );
  }

  if (error || !gem) {
    return (
      <div className="gem-details-error">
        <h2>❌ {error || 'Gem not found'}</h2>
        <button onClick={() => navigate('/my-gems')} className="back-btn">
          ← Back to My Gems
        </button>
      </div>
    );
  }

  const statusBadge = getStatusBadge(gem.status);

  return (
    <div className="gem-details-wrapper">
      {/* Header */}
      <div className="details-header">
        <button onClick={() => navigate('/my-gems')} className="back-button">
          ← Back to My Gems
        </button>
        <div className="header-actions">
          <button onClick={() => navigate(`/edit-gem/${gem._id}`)} className="edit-button">
            ✏️ Edit Gem
          </button>
        </div>
      </div>

      <div className="gem-details-content">
        {/* Left Column - Images */}
        <div className="details-left">
          <div className="main-image">
  {gem.images && gem.images.length > 0 ? (
    <>
      <img 
        src={gem.images[currentImageIndex].url.startsWith('http') 
          ? gem.images[currentImageIndex].url 
          : `http://localhost:5000${gem.images[currentImageIndex].url}`
        } 
        alt={gem.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23667eea" width="400" height="400"/%3E%3Ctext fill="%23fff" font-size="48" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E💎%3C/text%3E%3C/svg%3E';
        }}
      />
      {gem.images.length > 1 && (
        <div className="image-nav">
          <button 
            onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
            disabled={currentImageIndex === 0}
          >
            ‹
          </button>
          <span>{currentImageIndex + 1} / {gem.images.length}</span>
          <button 
            onClick={() => setCurrentImageIndex(Math.min(gem.images.length - 1, currentImageIndex + 1))}
            disabled={currentImageIndex === gem.images.length - 1}
          >
            ›
          </button>
        </div>
      )}
    </>
  ) : (
    <div className="no-image-large">💎</div>
  )}
</div>

         {gem.images && gem.images.length > 1 && (
  <div className="thumbnail-gallery">
    {gem.images.map((image, index) => (
      <div 
        key={index}
        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
        onClick={() => setCurrentImageIndex(index)}
      >
        <img 
          src={image.url.startsWith('http') 
            ? image.url 
            : `http://localhost:5000${image.url}`
          } 
          alt={`${gem.title} ${index + 1}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
      </div>
    ))}
  </div>
)}
        </div>

        {/* Right Column - Details */}
        <div className="details-right">
          {/* Status Badge */}
          <div className={`status-badge-large ${statusBadge.class}`}>
            <span className="badge-icon">{statusBadge.icon}</span>
            {statusBadge.text}
          </div>

          {/* Title & Price */}
          <h1 className="gem-title">{gem.title}</h1>
          {gem.price && (
            <div className="gem-price">${gem.price.toLocaleString()}</div>
          )}

          {/* Listing Info */}
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">Listing ID:</span>
              <span className="info-value">#{gem._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Listing Type:</span>
              <span className="info-value">{gem.listingType}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Listed On:</span>
              <span className="info-value">
                {new Date(gem.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Views:</span>
              <span className="info-value">{gem.views || 0}</span>
            </div>
          </div>

          {/* Gem Specifications */}
          <div className="specs-section">
            <h3>Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <div className="spec-label">Type</div>
                <div className="spec-value">{gem.gemType}</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Carat</div>
                <div className="spec-value">{gem.carat} ct</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Cut</div>
                <div className="spec-value">{gem.cut}</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Color</div>
                <div className="spec-value">{gem.color}</div>
              </div>
              {gem.clarity && (
                <div className="spec-item">
                  <div className="spec-label">Clarity</div>
                  <div className="spec-value">{gem.clarity}</div>
                </div>
              )}
              <div className="spec-item">
                <div className="spec-label">Origin</div>
                <div className="spec-value">{gem.origin}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h3>Description</h3>
            <p>{gem.description}</p>
          </div>
{gem.certificates && gem.certificates.length > 0 && (
  <div className="certificates-section">
    <h3>Certificates ({gem.certificates.length})</h3>
    <div className="certificates-list">
      {gem.certificates.map((cert, index) => (
        <a 
          key={index} 
          href={cert.url.startsWith('http') 
            ? cert.url 
            : `http://localhost:5000${cert.url}`
          } 
          target="_blank" 
          rel="noopener noreferrer"
          className="certificate-card"
        >
          <span className="cert-icon">📄</span>
          <div className="cert-info">
            <div className="cert-type">{cert.certificateType || 'Certificate'}</div>
            <div className="cert-link">View Document →</div>
          </div>
        </a>
      ))}
    </div>
  </div>
)}
        

          {/* Rejection Reason */}
          {gem.status === 'rejected' && gem.rejectionReason && (
            <div className="rejection-reason">
              <h4>❌ Rejection Reason:</h4>
              <p>{gem.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GemDetails;