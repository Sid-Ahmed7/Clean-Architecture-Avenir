import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { Cell, Pie, PieChart, PieLabelRenderProps, ResponsiveContainer, Tooltip } from "recharts";

interface ChartAccountManageProps {
    accounts: AccountModel[];
}

interface ChartDataItem {
    name: string;
    value: number;
    color: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        payload: ChartDataItem;
    }>;
}

export default function ChartAccountManage({accounts}: ChartAccountManageProps) {
    
    const accountColors: Record<string, string> = {
        CHECKING: "#3b82f6",
        SAVINGS: "#10b981",
    };

    const distributionByAccountType = Object.keys(accountColors).map((type) => {
        const total = accounts
            .filter((acc) => acc.accountType === type)
            .reduce((sum, acc) => sum + acc.currentBalance, 0);
        return {name: type, value: total, color: accountColors[type]};
    }).filter(item => item.value > 0);

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

    const renderLabel = (props: PieLabelRenderProps) => {
        const { name, percent } = props;
        if (percent === undefined || name === undefined) return null;
        return `${name} ${typeof percent === "number" ? (percent * 100).toFixed(0) : "0"}%`;
    };

    const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0];
            const percentage = ((data.value / totalBalance) * 100).toFixed(1);
            return (
                <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
                    <p className="font-semibold text-gray-900">{data.name}</p>
                    <p className="text-blue-600 font-bold">{data.value.toLocaleString()} EUR</p>
                    <p className="text-sm text-gray-600">{percentage}% du total</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Répartition par type</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={distributionByAccountType}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={renderLabel}
                    >
                        {distributionByAccountType.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}