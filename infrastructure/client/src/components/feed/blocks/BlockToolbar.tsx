import Button from "@/components/ui/Button";
import { TypeBlock } from "@/types/contentBlock";
import { Type, ImageIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface BlockToolbarProps {
    onAddBlock: (type: TypeBlock) => void;
    disabled?: boolean;
}

export function BlockToolbar ({onAddBlock, disabled} : BlockToolbarProps) {
    const t = useTranslations('components.feed.blocks.toolbar');
    return (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 w-full mb-2">
                {t('addBlock')}
            </p>
            
            <Button
                type="button"
                variant="secondary"
                onClick={() => onAddBlock(TypeBlock.TEXT)}
                disabled={disabled}
            >
                <Type size={16} className="mr-2" />
                {t('text')}
            </Button>

            <Button
                type="button"
                variant="secondary"
                onClick={() => onAddBlock(TypeBlock.MEDIA)}
                disabled={disabled}
            >
                <ImageIcon size={16} className="mr-2" />
                {t('media')}
            </Button>
        </div>
  );
}