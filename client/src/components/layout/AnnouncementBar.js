'use client';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar" role="banner" aria-label="Site announcement">
      <div className="announcement-inner">
        <span className="announcement-item">
          🚀 <strong>Free Delivery</strong> on orders above 300 EGP
        </span>
        <span className="announcement-dot">·</span>
        <span className="announcement-item">
          🌿 <strong>100% Fresh</strong> Daily
        </span>
        <span className="announcement-dot">·</span>
        <span className="announcement-item">
          💪 <strong>Calorie Counted</strong> Every Meal
        </span>
        <span className="announcement-dot">·</span>
        <span className="announcement-item">
          📞 <strong>01113395716</strong>
        </span>
      </div>

      <style jsx>{`
        .announcement-bar {
          background: var(--fs-black);
          height: var(--announcement-height);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .announcement-inner {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: rgba(255,255,255,0.85);
          white-space: nowrap;
          overflow-x: auto;
          padding: 0 16px;
          scrollbar-width: none;
        }
        .announcement-inner::-webkit-scrollbar { display: none; }
        .announcement-item { flex-shrink: 0; }
        .announcement-item strong { color: var(--fs-gold); }
        .announcement-dot {
          color: rgba(255,255,255,0.3);
          font-size: 14px;
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .announcement-dot:nth-child(4),
          .announcement-item:nth-child(5),
          .announcement-dot:nth-child(6),
          .announcement-item:nth-child(7) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
