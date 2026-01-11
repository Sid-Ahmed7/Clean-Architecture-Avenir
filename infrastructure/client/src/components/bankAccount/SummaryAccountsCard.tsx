import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { useTranslations } from "next-intl";

interface SummaryCardProps {
  accounts: AccountModel[];
}

export default function SummaryCard({ accounts }: SummaryCardProps) {
  const t = useTranslations("components.bankAccount.summaryCard");
  const totalBalance = accounts.reduce((sum, account) => sum + account.currentBalance, 0);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-blue-100 text-sm mb-1">{t("totalBalance")}</p>
          <p className="text-4xl font-bold">{totalBalance.toLocaleString()} EUR</p>
        </div>
      </div>
    </div>
  );
}
