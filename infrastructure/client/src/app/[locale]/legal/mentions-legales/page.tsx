import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales de BankAvenir.',
  robots: { index: false, follow: false }
};

export default function MentionsLegalesPage() {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions légales</h1>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Éditeur du site</h2>
          <p>
            BankAvenir SAS<br />
            Capital social : 10 000 000 €<br />
            Siège social : 42 Avenue des Champs-Élysées, 75008 Paris<br />
            RCS Paris : 123 456 789<br />
            SIRET : 123 456 789 00012<br />
            APE : 6419Z
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Directeur de publication</h2>
          <p>Jean Dupont, Président</p>


          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Agrément bancaire</h2>
          <p>
            BankAvenir est agréée en tant qu&apos;établissement de crédit par l&apos;Autorité de Contrôle Prudentiel et de Résolution (ACPR),
            4 Place de Budapest, CS 92459, 75436 Paris Cedex 09.
          </p>
        </div>
      </div>
    </div>
  );
}