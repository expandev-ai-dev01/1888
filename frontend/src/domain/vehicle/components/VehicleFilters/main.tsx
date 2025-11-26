import { useState, useEffect } from 'react';
import { Button } from '@/core/components/button';
import { Label } from '@/core/components/label';
import { Input } from '@/core/components/input';
import { Checkbox } from '@/core/components/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Separator } from '@/core/components/separator';
import { FilterIcon, XIcon } from 'lucide-react';
import type { VehicleFiltersProps } from './types';

function VehicleFilters({
  filters,
  availableBrands = [],
  availableModels = [],
  availableTransmissions = [],
  yearRange,
  priceRange,
  onFiltersChange,
  onApply,
  onClear,
}: VehicleFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [filteredModels, setFilteredModels] = useState(availableModels);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (localFilters.brands.length === 0) {
      setFilteredModels(availableModels);
    }
  }, [localFilters.brands, availableModels]);

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...localFilters.brands, brand]
      : localFilters.brands.filter((b) => b !== brand);

    const newModels = localFilters.models.filter((model) => {
      return newBrands.length === 0 || availableModels.includes(model);
    });

    const updatedFilters = {
      ...localFilters,
      brands: newBrands,
      models: newModels,
    };

    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleModelChange = (model: string, checked: boolean) => {
    const newModels = checked
      ? [...localFilters.models, model]
      : localFilters.models.filter((m) => m !== model);

    const updatedFilters = {
      ...localFilters,
      models: newModels,
    };

    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleTransmissionChange = (transmission: string, checked: boolean) => {
    const newTransmissions = checked
      ? [...localFilters.transmissions, transmission]
      : localFilters.transmissions.filter((t) => t !== transmission);

    const updatedFilters = {
      ...localFilters,
      transmissions: newTransmissions,
    };

    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleYearChange = (field: 'yearMin' | 'yearMax', value: string) => {
    const numValue = value ? parseInt(value, 10) : undefined;
    const updatedFilters = {
      ...localFilters,
      [field]: numValue,
    };

    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handlePriceChange = (field: 'priceMin' | 'priceMax', value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    const updatedFilters = {
      ...localFilters,
      [field]: numValue,
    };

    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilterIcon className="size-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {availableBrands.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">Marca</Label>
            <div className="space-y-2">
              {availableBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={localFilters.brands.includes(brand)}
                    onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="cursor-pointer font-normal">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredModels.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-base font-semibold">Modelo</Label>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {filteredModels.map((model) => (
                  <div key={model} className="flex items-center space-x-2">
                    <Checkbox
                      id={`model-${model}`}
                      checked={localFilters.models.includes(model)}
                      onCheckedChange={(checked) => handleModelChange(model, checked as boolean)}
                    />
                    <Label htmlFor={`model-${model}`} className="cursor-pointer font-normal">
                      {model}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {yearRange && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-base font-semibold">Ano</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="year-min">Mínimo</Label>
                  <Input
                    id="year-min"
                    type="number"
                    min={yearRange.min}
                    max={yearRange.max}
                    value={localFilters.yearMin ?? ''}
                    onChange={(e) => handleYearChange('yearMin', e.target.value)}
                    placeholder={yearRange.min.toString()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year-max">Máximo</Label>
                  <Input
                    id="year-max"
                    type="number"
                    min={yearRange.min}
                    max={yearRange.max}
                    value={localFilters.yearMax ?? ''}
                    onChange={(e) => handleYearChange('yearMax', e.target.value)}
                    placeholder={yearRange.max.toString()}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {priceRange && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-base font-semibold">Preço</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="price-min">Mínimo</Label>
                  <Input
                    id="price-min"
                    type="number"
                    min={0}
                    value={localFilters.priceMin ?? ''}
                    onChange={(e) => handlePriceChange('priceMin', e.target.value)}
                    placeholder="R$ 0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price-max">Máximo</Label>
                  <Input
                    id="price-max"
                    type="number"
                    min={0}
                    value={localFilters.priceMax ?? ''}
                    onChange={(e) => handlePriceChange('priceMax', e.target.value)}
                    placeholder="R$ 999.999"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {availableTransmissions.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="text-base font-semibold">Câmbio</Label>
              <div className="space-y-2">
                {availableTransmissions.map((transmission) => (
                  <div key={transmission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`transmission-${transmission}`}
                      checked={localFilters.transmissions.includes(transmission)}
                      onCheckedChange={(checked) =>
                        handleTransmissionChange(transmission, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`transmission-${transmission}`}
                      className="cursor-pointer font-normal"
                    >
                      {transmission}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        <div className="flex flex-col gap-2">
          <Button onClick={onApply} className="w-full">
            Aplicar Filtros
          </Button>
          <Button onClick={onClear} variant="outline" className="w-full">
            <XIcon className="size-4" />
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { VehicleFilters };
