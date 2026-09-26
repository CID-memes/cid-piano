import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`toast ${toast.type === 'error' ? 'toast-error' : toast.type === 'warning' ? 'toast-warning' : ''}`}
          onClick={() => onDismiss(toast.id)}
          style={{ cursor: 'pointer' }}
        >
          {toast.type === 'error' || toast.type === 'warning' ? (
            <AlertCircle size={20} color={toast.type === 'error' ? '#ef4444' : '#f59e0b'} />
          ) : (
            <CheckCircle size={20} color="#6366f1" />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{toast.title}</div>
            <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{toast.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
