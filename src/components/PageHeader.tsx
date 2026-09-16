'use client';

type PageHeaderProps = {
 title: string;
 titleAr?: string;
 description?: string;
 color?: string;
 emoji?: string;
 count?: number;
 countLabel?: string;
};

const BANNERS: Record<string, string> = {
 'Événements': '/images/page-banners/events-v1.webp',
 'Solidarité': '/images/page-banners/solidarity-v1.webp',
 'Éducation': '/images/page-banners/education-v2.webp',
 'Hajj & Omra': '/images/page-banners/hajj-v1.webp',
};

export default function PageHeader({ title, titleAr, description, count, countLabel }: PageHeaderProps) {
 const image = BANNERS[title] ?? '/images/page-banners/services-v1.webp';

 return (
  <header className="page-banner" aria-labelledby="page-banner-title">
   <img src={image} alt="" className="page-banner__image" />
   <div className="page-banner__shade" aria-hidden="true" />
   <div className="page-banner__content">
    <span className="page-banner__eyebrow">AL-WASIL · ANNUAIRE COMMUNAUTAIRE</span>
    <div className="page-banner__bottom">
     <div>
      <h1 id="page-banner-title">{title}</h1>
      <div className="page-banner__meta">
       {titleAr && <span lang="ar" dir="rtl">{titleAr}</span>}
       {description && <p>{description}</p>}
      </div>
     </div>
     {count !== undefined && countLabel && (
      <div className="page-banner__count">
       <strong>{count}</strong>
       <span>{countLabel}</span>
      </div>
     )}
    </div>
   </div>
  </header>
 );
}
