import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'resume',
    price: 99
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('https://bossmind-orchestrator.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now().toString(),
          service: formData.service,
          price: formData.price,
          customer: { email: formData.email, name: formData.name }
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Order received! We’ll contact you shortly.');
        setFormData({ name: '', email: '', service: 'resume', price: 99 });
      } else {
        setMessage('❌ Something went wrong. Please try again.');
      }
    } catch (err) {
      setMessage('❌ Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
          Resumora – Professional Resumes
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          Get a standout resume crafted by experts. Place your order now.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Service</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            >
              <option value="resume">Resume + 1 Free Edit – $99</option>
              <option value="cover">Cover Letter + 1 Free Edit – $49</option>
              <option value="package">Complete Package – $199</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '15px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'Processing...' : 'Order Now'}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: message.startsWith('✅') ? '#d4edda' : '#f8d7da',
            color: message.startsWith('✅') ? '#155724' : '#721c24',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#999' }}>
          Secure order – we'll contact you within 24 hours.
        </div>
      </div>
    </div>
  );
}

export default App;