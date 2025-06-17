// src/components/PropertyDetails.js
import React from 'react';

function PropertyDetails({ property }) {
  console.log('PropertyDetails received:', property);
  console.log('Lists field:', property.lists);
  console.log('Lists array:', property.lists_array);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    section: {
      backgroundColor: '#f9fafb',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
    },
    sectionTitle: {
      margin: '0 0 15px 0',
      fontSize: '1.1rem',
      color: '#374151',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
    },
    item: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    label: {
      fontSize: '0.875rem',
      color: '#6b7280',
      fontWeight: '500',
    },
    value: {
      fontSize: '1rem',
      color: '#1f2937',
      fontWeight: '500',
    },
    listsSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      borderRadius: '8px',
      color: 'white',
    },
    listsTitle: {
      margin: '0 0 15px 0',
      fontSize: '1.1rem',
      color: 'white',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    listsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    listTag: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    noLists: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontStyle: 'italic',
    },
    valueHighlight: {
      backgroundColor: '#10b981',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '6px',
      fontWeight: '600',
      display: 'inline-block',
    },
    debugInfo: {
      backgroundColor: '#fee2e2',
      padding: '10px',
      borderRadius: '4px',
      marginTop: '10px',
      fontSize: '0.875rem',
      color: '#991b1b',
    }
  };

  // Format checkval as currency
  const formatCurrency = (value) => {
    if (!value || value === 'Call us') return 'Call us';
    const num = parseFloat(value);
    return isNaN(num) ? value : `$${num.toLocaleString()}`;
  };

  // Format the mail period
  const formatMailPeriod = () => {
    if (!property.mail_month && !property.mail_year) return 'N/A';
    if (!property.mail_year) return property.mail_month || 'N/A';
    if (!property.mail_month) return property.mail_year.toString();
    return `${property.mail_month} ${property.mail_year}`;
  };

  // Process lists - handle both comma-separated string and array
  const getListsArray = () => {
    if (property.lists_array && Array.isArray(property.lists_array)) {
      return property.lists_array;
    }
    if (property.lists && typeof property.lists === 'string') {
      return property.lists.split(',').map(item => item.trim()).filter(item => item);
    }
    return [];
  };

  const listsArray = getListsArray();

  return (
    <div style={styles.container}>
      {/* Owner Information */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span>👤</span>
          Owner Information
        </h3>
        <div style={styles.grid}>
          <div style={styles.item}>
            <span style={styles.label}>Full Name</span>
            <span style={styles.value}>{property.full_name || 'N/A'}</span>
          </div>
          <div style={styles.item}>
            <span style={styles.label}>First Name</span>
            <span style={styles.value}>{property.first_name || 'N/A'}</span>
          </div>
          <div style={styles.item}>
            <span style={styles.label}>Last Name</span>
            <span style={styles.value}>{property.last_name || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Property Address */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span>🏠</span>
          Property Address
        </h3>
        <div style={styles.grid}>
          <div style={styles.item}>
            <span style={styles.label}>Street Address</span>
            <span style={styles.value}>{property.property_address || 'N/A'}</span>
          </div>
          <div style={styles.item}>
            <span style={styles.label}>City</span>
            <span style={styles.value}>{property.property_city || 'N/A'}</span>
          </div>
          <div style={styles.item}>
            <span style={styles.label}>State</span>
            <span style={styles.value}>{property.property_state || 'N/A'}</span>
          </div>
          <div style={styles.item}>
            <span style={styles.label}>ZIP Code</span>
            <span style={styles.value}>{property.property_zip || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>
          <span>📊</span>
          Additional Details
        </h3>
        <div style={styles.grid}>
          <div style={styles.item}>
            <span style={styles.label}>Property Value</span>
            <span style={styles.value}>
              <span style={styles.valueHighlight}>{formatCurrency(property.checkval)}</span>
            </span>
          </div>
          <div style={styles.item}>
            <span style={styles.label}>Mail Period</span>
            <span style={styles.value}>{formatMailPeriod()}</span>
          </div>
        </div>
      </div>

      {/* Lists Section - The main feature */}
      <div style={styles.listsSection}>
        <h3 style={styles.listsTitle}>
          <span>📋</span>
          Associated Lists
        </h3>
        {listsArray.length > 0 ? (
          <div style={styles.listsContainer}>
            {listsArray.map((list, index) => (
              <div key={index} style={styles.listTag}>
                {list}
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p style={styles.noLists}>No lists associated with this property</p>
            {/* Debug info */}
            <div style={styles.debugInfo}>
              Debug: lists field = {property.lists || 'null/undefined'}, 
              lists_array = {property.lists_array ? JSON.stringify(property.lists_array) : 'null/undefined'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyDetails;