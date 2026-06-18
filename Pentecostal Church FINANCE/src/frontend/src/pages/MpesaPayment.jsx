import { useState } from 'react'
import api from '../services/api'

export default function MpesaPayment() {
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('offering')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!phone || !amount) {
      setError('Phone number and amount are required.')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/mpesa/stkpush', {
        phone,
        amount: Number(amount),
        category,
      })
      setSuccess(res.data.message || 'STK push sent! Check your phone to complete payment.')
      setPhone('')
      setAmount('')
    } catch (err) {
      setError(err.response?.data?.message || 'M-Pesa request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card">
      <h2>M-Pesa Payment</h2>
      <p style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '20px' }}>
        Initiate an M-Pesa STK push to collect payment directly from a phone.
      </p>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0712345678"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (KES)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="offering">Offering</option>
            <option value="tithe">Tithe</option>
            <option value="thanksgiving">Thanksgiving</option>
            <option value="aob">AOB</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Sending STK Push...' : 'Send Payment Request'}
        </button>
      </form>
    </div>
  )
}
