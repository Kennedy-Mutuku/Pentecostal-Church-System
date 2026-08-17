import { useEffect } from 'react';

interface LightboxProps {
  src: string;
  alt?: string;
  caption?: string;
  onClose: () => void;
  /** px from top to leave room for a fixed header (default 0) */
  offsetTop?: number;
  /** px from left to leave room for a fixed sidebar (default 0) */
  offsetLeft?: number;
}

const Lightbox = ({ src, alt = '', caption, onClose, offsetTop = 0, offsetLeft = 0 }: LightboxProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: offsetTop,
        left: offsetLeft,
        right: 0,
        bottom: 0,
        zIndex: 200000,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'lb-in 0.18s ease',
      }}
    >
      {/* Close button — always in top-right of the overlay */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 14, right: 16,
          width: 36, height: 36,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.22)',
          borderRadius: '50%', cursor: 'pointer',
          color: '#fff', fontSize: 22, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.25)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
        aria-label="Close"
      >
        ×
      </button>

      {/* Image — constrained to the overlay's visible area */}
      <img
        src={src}
        alt={alt}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: `min(88%, calc(100vw - ${offsetLeft + 40}px))`,
          maxHeight: caption ? `calc(100vh - ${offsetTop + 80}px)` : `calc(100vh - ${offsetTop + 48}px)`,
          borderRadius: 10,
          boxShadow: '0 24px 80px rgba(0,0,0,0.65)',
          objectFit: 'contain',
          display: 'block',
          userSelect: 'none',
        }}
      />

      {/* Caption */}
      {caption && (
        <p
          onClick={e => e.stopPropagation()}
          style={{
            marginTop: 12,
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            textAlign: 'center',
            maxWidth: 460,
            lineHeight: 1.5,
          }}
        >
          {caption}
        </p>
      )}

      <style>{`
        @keyframes lb-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Lightbox;
