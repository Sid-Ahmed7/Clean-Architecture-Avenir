import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description: 'Conditions générales de vente et d\'utilisation de BankAvenir.',
  robots: { index: false, follow: false }
};

export default function CGVPage() {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Conditions générales de vente</h1>

          <p className="text-gray-600 mb-6">Version en vigueur au {new Date().toLocaleDateString('fr-FR')}</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Article 1 - Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent la relation contractuelle entre BankAvenir et ses clients
            pour l'utilisation des services bancaires proposés.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Article 2 - Ouverture de compte</h2>
          <p>
            L'ouverture d'un compte est soumise à l'acceptation de votre dossier par BankAvenir.
            Vous devez être majeur et résider fiscalement en France.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Article 3 - Tarification</h2>
          <p>
            Les tarifs en vigueur sont disponibles sur notre site et dans votre espace client.
            Toute modification tarifaire vous sera notifiée 2 mois avant son application.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Article 4 - Résiliation</h2>
          <p>
            Vous pouvez résilier votre compte à tout moment, sans frais. BankAvenir se réserve le droit de clôturer
            votre compte en cas de manquement grave aux présentes conditions.
          </p>
        </div>
      </div>
    </div>
  );
}