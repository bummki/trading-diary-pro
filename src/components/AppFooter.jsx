import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

function AppFooter() {
  const { t } = useLanguage();

  return (
    <div style={{
      backgroundColor: '#f8f8f8',
      padding: '40px 20px',
      borderTop: '1px solid #eee',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '30px',
      }}>

        {/* About Section */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3 style={{ fontSize: '20px', color: '#2c3e50', marginBottom: '15px', fontWeight: 'bold' }}>{t('footer_about_title')}</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '10px' }}>{t('footer_about_desc1')}</p>
          <p style={{ lineHeight: 1.6 }}>{t('footer_about_desc2')}</p>
        </div>

        {/* Features Section */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3 style={{ fontSize: '20px', color: '#2c3e50', marginBottom: '15px', fontWeight: 'bold' }}>{t('footer_features_title')}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#28a745', fontSize: '18px', marginRight: '10px' }}>✔</span>
              {t('footer_feature1')}
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#28a745', fontSize: '18px', marginRight: '10px' }}>✔</span>
              {t('footer_feature2')}
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#28a745', fontSize: '18px', marginRight: '10px' }}>✔</span>
              {t('footer_feature3')}
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#28a745', fontSize: '18px', marginRight: '10px' }}>✔</span>
              {t('footer_feature4')}
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#28a745', fontSize: '18px', marginRight: '10px' }}>✔</span>
              {t('footer_feature5')}
            </li>
          </ul>
        </div>

        {/* Usage Section */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3 style={{ fontSize: '20px', color: '#2c3e50', marginBottom: '15px', fontWeight: 'bold' }}>{t('footer_usage_title')}</h3>
          <ol style={{ listStyle: 'decimal', paddingLeft: '20px', margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <strong>{t('footer_usage1_strong')}:</strong> {t('footer_usage1_text')}
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>{t('footer_usage2_strong')}:</strong> {t('footer_usage2_text')}
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>{t('footer_usage3_strong')}:</strong> {t('footer_usage3_text')}
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>{t('footer_usage4_strong')}:</strong> {t('footer_usage4_text')}
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>{t('footer_usage5_strong')}:</strong> {t('footer_usage5_text')}
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong>{t('footer_usage6_strong')}:</strong> {t('footer_usage6_text')}
            </li>
          </ol>
        </div>

        {/* Contact Section */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <h3 style={{ fontSize: '20px', color: '#2c3e50', marginBottom: '15px', fontWeight: 'bold' }}>{t('footer_contact_title')}</h3>
          <p style={{ lineHeight: 1.6, marginBottom: '10px' }}>{t('footer_contact_desc1')}</p>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff', marginBottom: '20px' }}>tradingdiarypro521@gmail.com</p>
          <p style={{ lineHeight: 1.6 }}>{t('footer_contact_desc2')}</p>
        </div>

      </div>
      <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee', color: '#777' }}>
        <p>&copy; 2025 TradingDiaryPro. {t('footer_copyright')}</p>
      </div>
    </div>
  );
}

export default AppFooter;


