export default function LegalPage() {
  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '760px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Informations légales</h1>

      {[
        {
          id: 'mentions',
          title: '📋 Mentions légales',
          content: [
            { h: 'Éditeur du site', p: 'Al-Wasil Platform est un projet communautaire indépendant sans but lucratif, développé à titre personnel. Hébergé sur Vercel (San Francisco, CA, USA).' },
            { h: 'Contact', p: 'Pour toute question : via le formulaire de contact sur le site.' },
            { h: 'Hébergeur', p: 'Vercel Inc., 340 Pine Street Suite 701, San Francisco, California 94104, USA.' },
          ],
        },
        {
          id: 'confidentialite',
          title: '🔒 Politique de confidentialité & RGPD',
          content: [
            { h: 'Données collectées', p: 'Al-Wasil ne collecte aucune donnée personnelle sans votre consentement explicite. Les formulaires de contact collectent uniquement les informations nécessaires au traitement de votre demande (nom, email, message).' },
            { h: 'Cookies', p: 'Le site utilise uniquement des cookies techniques nécessaires au fonctionnement. Aucun cookie publicitaire tiers n\'est utilisé sans votre accord.' },
            { h: 'Vos droits', p: 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous via le formulaire.' },
            { h: 'Conservation', p: 'Les données des formulaires sont conservées 12 mois maximum, puis supprimées.' },
          ],
        },
        {
          id: 'cgu',
          title: '📜 Conditions Générales d\'Utilisation',
          content: [
            { h: 'Accès au service', p: 'Al-Wasil est accessible gratuitement à tout utilisateur disposant d\'un accès internet. Tous les frais liés à l\'accès sont à la charge de l\'utilisateur.' },
            { h: 'Contenu', p: 'Les informations publiées sur Al-Wasil sont issues de sources communautaires. Bien que nous fassions notre possible pour vérifier leur exactitude, nous recommandons de toujours confirmer les informations (horaires, créneaux, tarifs) directement auprès des établissements concernés.' },
            { h: 'Responsabilité', p: 'Al-Wasil ne peut être tenu responsable des informations incorrectes ou obsolètes. Les liens vers des sites tiers sont fournis à titre indicatif.' },
            { h: 'Propriété intellectuelle', p: 'Le code source, les designs et les contenus éditoriaux d\'Al-Wasil sont la propriété de leurs auteurs respectifs. La réutilisation sans autorisation est interdite.' },
          ],
        },
      ].map(section => (
        <section key={section.id} id={section.id} style={{ marginBottom: '3rem', paddingTop: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '2px solid var(--border-color)' }}>
            {section.title}
          </h2>
          {section.content.map(item => (
            <div key={item.h} style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text-primary)' }}>{item.h}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.p}</p>
            </div>
          ))}
        </section>
      ))}

      <div style={{ padding: '1.25rem', borderRadius: '0.75rem', backgroundColor: '#f5f5f4', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        Dernière mise à jour : mars 2026. Pour toute question légale, utilisez notre{' '}
        <a href="/contact" style={{ color: '#0d9488', fontWeight: 600, textDecoration: 'none' }}>formulaire de contact</a>.
      </div>
    </div>
  );
}
