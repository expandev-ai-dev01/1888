import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/select';
import { ArrowUpDownIcon } from 'lucide-react';
import type { VehicleSortProps } from './types';

function VehicleSort({ value, onChange }: VehicleSortProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDownIcon className="text-muted-foreground size-4" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevância</SelectItem>
          <SelectItem value="price_asc">Preço (menor para maior)</SelectItem>
          <SelectItem value="price_desc">Preço (maior para menor)</SelectItem>
          <SelectItem value="year_newest">Ano (mais recente)</SelectItem>
          <SelectItem value="year_oldest">Ano (mais antigo)</SelectItem>
          <SelectItem value="model_az">Modelo (A-Z)</SelectItem>
          <SelectItem value="model_za">Modelo (Z-A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export { VehicleSort };
