'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Send, RotateCcw, LayoutDashboard, Check, X } from 'lucide-react';
import type { CategoryForm } from '@/lib/admin-forms';

const V = '#7c3aed';
const V_LIGHT = '#f5f3ff';
const V_BORDER = '#ede9fe';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  border: `1.5px solid ${V_BORDER}`,
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Poppins, sans-serif',
  color: '#1c1917',
  backgroundColor: '#faf9ff',
  transition: 'border-color 0.15s',
};

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
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          backgroundColor: V_LIGHT, border: `2px solid ${V_BORDER}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
        }}>
          <CheckCircle size={30} color={V} strokeWidth={1.8} />
        </div>
        <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.5rem', color: '#1c1917' }}>
          Fiche envoyée !
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
          {message}
        </p>
        <p style={{ color: '#a8a29e', fontSize: '0.78rem', marginBottom: '2rem' }}>
          Vérifie ta boîte mail pour valider la fiche.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setStatus('idle'); setData({}); }} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.75rem 1.5rem', backgroundColor: V, color: 'white',
            border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem',
            cursor: 'pointer',
          }}>
            <RotateCcw size={14} /> Ajouter une autre fiche
          </button>
          <button onClick={() => router.push('/admin')} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.75rem 1.5rem', backgroundColor: 'white', color: V,
            border: `1.5px solid ${V_BORDER}`, borderRadius: '10px', fontWeight: 600,
            fontSize: '0.875rem', cursor: 'pointer',
          }}>
            <LayoutDashboard size={14} /> Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {form.fields.map(field => (
        <div key={field.key}>
          <label style={{
            display: 'block', fontSize: '0.75rem', fontWeight: 700,
            color: '#4c1d95', marginBottom: '0.4rem',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {field.label}
            {field.required && <span style={{ color: '#7c3aed', marginLeft: '4px' }}>*</span>}
          </label>

          {/* Textarea */}
          {field.type === 'textarea' && (
            <textarea
              value={(data[field.key] as string) || ''}
              onChange={e => setValue(field.key, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          )}

          {/* Select */}
          {field.type === 'select' && (
            <select
              value={(data[field.key] as string) || ''}
              onChange={e => setValue(field.key, e.target.value)}
              required={field.required}
              style={{ ...inputStyle, backgroundColor: '#faf9ff' }}
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
                    style={{
                      padding: '0.35rem 0.875rem', borderRadius: '20px',
                      border: `1.5px solid ${selected ? V : V_BORDER}`,
                      backgroundColor: selected ? V : 'white',
                      color: selected ? 'white' : '#6b7280',
                      fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Boolean */}
          {field.type === 'boolean' && (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {[
                { value: 'TRUE',  label: 'Oui', icon: <Check size={13} strokeWidth={2.5} /> },
                { value: 'FALSE', label: 'Non', icon: <X size={13} strokeWidth={2.5} /> },
              ].map(opt => {
                const selected = (data[field.key] as string) === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue(field.key, opt.value)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      padding: '0.5rem 1.25rem', borderRadius: '10px',
                      border: `1.5px solid ${selected ? V : V_BORDER}`,
                      backgroundColor: selected ? V : 'white',
                      color: selected ? 'white' : '#6b7280',
                      fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Input (text, url, tel, email, number, date) */}
          {!['textarea', 'select', 'multiselect', 'boolean'].includes(field.type) && (
            <input
              type={field.type}
              value={(data[field.key] as string) || ''}
              onChange={e => setValue(field.key, e.target.value)}
              required={field.required}
              placeholder={field.placeholder}
              style={inputStyle}
            />
          )}

          {field.hint && (
            <p style={{ fontSize: '0.72rem', color: '#a8a29e', margin: '0.3rem 0 0', fontStyle: 'italic' }}>
              {field.hint}
            </p>
          )}
        </div>
      ))}

      {status === 'error' && (
        <div style={{
          padding: '0.875rem 1rem', backgroundColor: '#fef2f2',
          border: '1px solid #fca5a5', borderRadius: '10px',
          fontSize: '0.85rem', color: '#dc2626',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <X size={14} /> {message}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          padding: '0.9rem', backgroundColor: status === 'loading' ? '#a78bfa' : V,
          color: 'white', border: 'none', borderRadius: '12px',
          fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.95rem',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          marginTop: '0.5rem', transition: 'background 0.2s',
          boxShadow: '0 4px 12px rgba(109,40,217,0.25)',
        }}
      >
        <Send size={16} strokeWidth={2} />
        {status === 'loading' ? 'Envoi en cours...' : 'Envoyer pour validation'}
      </button>
    </form>
  );
}
