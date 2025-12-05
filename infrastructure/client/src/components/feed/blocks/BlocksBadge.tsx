interface BlocksBadgeProps {
    order: number;
}

export function BlocksBadge({order} : BlocksBadgeProps) {
    return (
         <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
            {order + 1}
        </div>
    )
}