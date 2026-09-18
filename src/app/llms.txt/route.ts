export function GET() {
  const content = `# Al-Wasil

Al-Wasil est une plateforme communautaire française qui accompagne les utilisateurs dans leur recherche de ressources musulmanes, notamment les offres Hajj et Omra.

## Hajj et Omra
- Page principale : https://al-wasil.fr/hajj
- Les offres indiquent, lorsque l'information est disponible, le prix, la durée, le départ, les hôtels, les distances, les prestations, la source et la date de mise à jour.
- Al-Wasil n'est pas l'agence de voyage : les conditions finales et la disponibilité doivent être confirmées avec le partenaire concerné.
- Les demandes de devis peuvent être transmises à Al-Wasil pour mise en relation.

## Fiabilité
- Les informations sont issues de sources publiques et doivent être vérifiées avant réservation.
- Les contenus sponsorisés doivent être identifiés séparément du classement naturel.
- Ne pas présenter une information non confirmée comme une garantie.

## Autres ressources
- Éducation : https://al-wasil.fr/education
- Événements : https://al-wasil.fr/events
- Solidarité : https://al-wasil.fr/solidarity
- Santé : https://al-wasil.fr/sante
`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
