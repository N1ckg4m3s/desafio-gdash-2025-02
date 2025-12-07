interface DashboardCardProps {
    title: string;
    value: string;
    info?: string;
    icon?: string;
    layout?: "default" | "icon" | "text";
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    value,
    info,
    icon,
    layout = "default",
}) => {
    const isIconLayout = layout === "icon" && icon;
    const isTextLayout = layout === "text";

    return (
        <div className="p-4 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col gap-2">
            <p className="text-sm text-zinc-500">{title}</p>

            {isIconLayout && (
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl">{icon}</span>
                    <h2 className="text-lg font-semibold">{value}</h2>
                </div>
            )}

            {isTextLayout && (
                <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-sm font-semibold">{value}</h2>
                </div>
            )}

            {!isTextLayout && !isIconLayout && (
                <h2 className="text-4xl font-bold mt-1">{value}</h2>
            )}

            <p className="text-xs text-zinc-400">{info}</p>
        </div>
    );
};
