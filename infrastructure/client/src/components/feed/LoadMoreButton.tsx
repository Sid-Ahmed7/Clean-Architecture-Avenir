
import Button from "../ui/Button";
import { Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
}

export function LoadMoreButton({hasNextPage, isFetchingNextPage, fetchNextPage,}: LoadMoreButtonProps) {
    if (!hasNextPage){
        return null;
    }
    
    return (
        <div className="flex justify-center pt-4">
            <Button
                onClick={fetchNextPage}
                disabled={isFetchingNextPage}
                variant="primary"
            >
                {isFetchingNextPage ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Chargement...
                    </>
                ) : (
                    "Charger plus"
                )}
            </Button>
        </div>
    );
}
