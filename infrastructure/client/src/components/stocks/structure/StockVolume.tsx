import { useTranslations } from 'next-intl';

interface StockVolumeProps {
    volume?: number;
    averageVolume?: number;
}

export function StockVolume({volume, averageVolume}: StockVolumeProps) {
    const t = useTranslations('components.stocks.structure.volume');
    return (
    <div className="mb-4 text-xs text-gray-600">
      <div className="flex justify-between">
        <span>{t('volume')}</span>
        <span className="font-semibold text-gray-900">
          {volume && volume.toLocaleString('fr-FR')}
        </span>
      </div>
      <div className="flex justify-between mt-1">
        <span>{t('averageVolume')}</span>
        <span className="font-semibold text-gray-900">
          {averageVolume && averageVolume.toLocaleString('fr-FR')}
        </span>
      </div>
    </div>
  );
}