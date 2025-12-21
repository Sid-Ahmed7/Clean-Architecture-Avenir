interface StockVolumeProps {
    volume?: number;
    averageVolume?: number;
}

export function StockVolume({volume, averageVolume}: StockVolumeProps) {
    return (
    <div className="mb-4 text-xs text-gray-600">
      <div className="flex justify-between">
        <span>Volume</span>
        <span className="font-semibold text-gray-900">
          {volume && volume.toLocaleString('fr-FR')}
        </span>
      </div>
      <div className="flex justify-between mt-1">
        <span>Volume moy.</span>
        <span className="font-semibold text-gray-900">
          {averageVolume && averageVolume.toLocaleString('fr-FR')}
        </span>
      </div>
    </div>
  );
}