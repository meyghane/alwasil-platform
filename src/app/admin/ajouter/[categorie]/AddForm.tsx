'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CategoryForm } from '@/lib/admin-forms';

export default function AddForm({ categorie, form }: { categorie: string; form: CategoryForm }) {
  const [data, setData] = useState<Record<string, string | string[]>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  function setValue(key: string, value: string | string[]) {
    setData(prev => ({ ...prev, [key]: value }));
  }

  function toggleMultiselect(key: string, option: string) {
    const current = (data[key] as string[]) || [];
    const next = current.includes(option)
      ? current.filter(v => v !== option)
      : [...current, option];
    setValue(key, next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    // Convertir les multiselect en chaînes virgule
    const serialized: Record<string, string> = {};
    for (const [k, v] of Object.entries(data)) {
      serialized[k] = Array.isArray(v) ? v.join(',') : String(v ?? '');
    }

    const res = await fetch('/api/admin/soumettre', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categorie, data: serialized }),
    });

    const json = await res.json();
    if (res.ok) {
      setStatus('success');
      setMessage(json.message);
    } else {
      setStatus('error');
      setMessage(json.error || 'Erreur lors de l\'envoi');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Email envoyé !</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setStatus('idle'); setData({}); }} style={{ padding: '0.75rem 1.5rem', backgroundColor: form.color, color: 'white', border: '2px solid #0a0a0a', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '3px 3px 0 #0a0a0a' }}>
            + Ajouter une autre fiche
          </button>
          <button onClick={() => router.push('/admin')} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'white', color: '#0a0a0a', border: '2px solid #0a0a0a', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '3px 3px 0 #0a0a0a' }}>
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {form.fields.map(field => (
        <div key={field.key}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {field.label}
            {field.required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
          </label>

          {/* Textarea */}
          {field.type === 'textarea' && (
            <textarea
              value={(data[field.key] as string) || ''}
              onChange={e => setValue(field.key, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              rows={3}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          )}

          {/* Select */}
          {field.type === 'select' && (
            <select
              value={(data[field.key] as string) || ''}
              onChange={e => setValue(field.key, e.target.value)}
              required={field.required}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}
            >
              <option value="">— Choisir —</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {/* Multiselect */}
          {field.type === 'multiselect' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {field.options?.map(opt => {
                const selected = ((data[field.key] as string[]) || []).includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleMultiselect(field.key, opt.value)}
                    style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: `2px solid ${selected ? form.color : '#e5e7eb'}`, backgroundColor: selected ? form.color : 'white', color: selected ? 'white' : '#374151', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.1s' }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Boolean */}
          {field.type === 'boolean' && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[{ value: 'TRUE', label: '✅ Oui' }, { value: 'FALSE', label: '❌ Non' }].map(opt => {
                const selected = (data[field.key] as string) === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue(field.key, opt.value)}
                    style={{ padding: '0.4rem 1rem', borderRadius: '6px', border: `2px solid ${selected ? '#0a0a0a' : '#e5e7eb'}`, backgroundColor: selected ? '#0a0a0a' : 'white', color: selected ? 'white' : '#374151', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tous les autres (text, url, tel, email, number, date) */}
          {!['textarea', 'select', 'multiselect', 'boolean'].includes(field.type) && (
            <input
              type={field.type}
              value={(data[field.key] as string) || ''}
              onChange={e => setValue(field.key, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1.5px solid #e5e7eb', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
          )}

          {field.hint && (
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '0.3rem 0 0' }}>{field.hint}</p>
          )}
        </div>
      ))}

      {status === 'error' && (
        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '0.85rem', color: '#dc2626' }}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{ padding: '0.875rem', backgroundColor: form.color, color: 'white', border: '2px solid #0a0a0a', borderRadius: '8px', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.95rem', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1, boxShadow: '4px 4px 0 #0a0a0a', marginTop: '0.5rem' }}
      >
        {status === 'loading' ? 'Envoi en cours...' : `${form.emoji} Envoyer pour validation`}
      </button>
    </form>
  );
}
