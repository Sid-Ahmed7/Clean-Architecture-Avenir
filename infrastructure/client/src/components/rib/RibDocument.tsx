import { RibData } from "@/types/rib";

type Props = {
    rib: RibData;
};

export function RibDocument({ rib }: Props) {
    const generatedAt = new Date().toLocaleString("fr-FR");
    const style = `
        body { margin: 0; background: #f3f4f6; font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; }
        .rib-card { max-width: 820px; margin: 32px auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08); }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .title { font-size: 22px; margin: 0; color: #111827; font-weight: 700; }
        .subtitle { margin: 4px 0 0 0; color: #6b7280; font-size: 14px; }
        .badge { color: #0f172a; border: 1px solid #d1d5db; padding: 6px 12px; border-radius: 10px; font-weight: 600; letter-spacing: 0.04em; background: #f9fafb; }
        .section { margin: 16px 0 8px 0; color: #111827; font-size: 13px; font-weight: 700; letter-spacing: 0.02em; }
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        .card { padding: 12px; border-radius: 10px; border: 1px solid #e5e7eb; background: #f9fafb; }
        .label { text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em; color: #6b7280; margin: 0 0 4px 0; }
        .value { margin: 0; font-size: 15px; font-weight: 700; color: #111827; }
        .footer { margin-top: 18px; text-align: right; font-size: 12px; color: #6b7280; }
        .divider { height: 1px; background: #e5e7eb; margin: 8px 0 12px 0; border: none; }
    `;

    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <title>RIB - {rib.bankName}</title>
                <style dangerouslySetInnerHTML={{ __html: style }} />
            </head>
            <body>
                <div className="rib-card">
                    <div className="header">
                        <div>
                            <h1 className="title">{rib.bankName}</h1>
                            <p className="subtitle">Relevé d'Identité Bancaire</p>
                        </div>
                        <span className="badge">RIB</span>
                    </div>

                    <hr className="divider" />
                    <p className="section">Titulaire & coordonnées</p>
                    <div className="grid">
                        <div className="card">
                            <p className="label">Titulaire</p>
                            <p className="value">{rib.holderName}</p>
                        </div>
                        <div className="card">
                            <p className="label">Adresse</p>
                            <p className="value">{rib.holderAddress || "Adresse non renseignée"}</p>
                        </div>
                    </div>

                    <p className="section">Références du compte</p>
                    <div className="grid">
                        <div className="card">
                            <p className="label">IBAN</p>
                            <p className="value">{rib.iban}</p>
                        </div>
                        <div className="card">
                            <p className="label">BIC</p>
                            <p className="value">{rib.bic}</p>
                        </div>
                        <div className="card">
                            <p className="label">Numéro de compte</p>
                            <p className="value">{rib.accountNumberFormatted}</p>
                        </div>
                        <div className="card">
                            <p className="label">Devise</p>
                            <p className="value">{rib.currency}</p>
                        </div>
                    </div>

                    <div className="footer">Généré le {generatedAt}</div>
                </div>
            </body>
        </html>
    );
}

