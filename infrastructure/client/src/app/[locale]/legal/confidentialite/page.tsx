export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et protection des données de BankAvenir.',
  robots: { index: false, follow: false }
};

export default function ConfidentialitePage() {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>

          <p className="text-gray-600 mb-6">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Collecte des données</h2>
          <p>
            Nous collectons les données suivantes :
          </p>
          <ul>
            <li>Données d'identification (nom, prénom, date de naissance)</li>
            <li>Coordonnées (adresse, email, téléphone)</li>
            <li>Données financières (RIB, revenus, transactions)</li>
            <li>Données de connexion (adresse IP, logs)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Utilisation des données</h2>
          <p>
            Vos données sont utilisées pour :
          </p>
          <ul>
            <li>La gestion de votre compte bancaire</li>
            <li>Le respect de nos obligations légales (KYC, LCB-FT)</li>
            <li>L'amélioration de nos services</li>
            <li>La prévention de la fraude</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit à la portabilité</li>
            <li>Droit d'opposition</li>
          </ul>

          <p className="mt-8">
            Pour exercer vos droits, contactez-nous à : <a href="mailto:dpo@bankavenir.com" className="text-blue-600 hover:text-blue-700">dpo@bankavenir.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}