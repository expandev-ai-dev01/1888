import { Card, CardContent } from '@/core/components/card';
import { Badge } from '@/core/components/badge';
import { cn } from '@/core/lib/utils';
import type { VehicleCardProps } from './types';

function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatKm = (km?: number) => {
    if (!km) return null;
    return new Intl.NumberFormat('pt-BR').format(km) + ' km';
  };

  const handleClick = () => {
    if (onClick) {
      onClick(vehicle.id);
    }
  };

  return (
    <Card
      className={cn(
        'group cursor-pointer overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
        onClick && 'hover:border-primary'
      )}
      onClick={handleClick}
    >
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        <img
          src={vehicle.imagem_principal}
          alt={`${vehicle.marca} ${vehicle.modelo}`}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-car.jpg';
          }}
        />
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-1 text-lg font-semibold leading-tight">
            {vehicle.marca} {vehicle.modelo}
          </h3>
          <p className="text-muted-foreground text-sm">Ano: {vehicle.ano}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {vehicle.quilometragem && (
            <Badge variant="secondary">{formatKm(vehicle.quilometragem)}</Badge>
          )}
          {vehicle.cambio && <Badge variant="outline">{vehicle.cambio}</Badge>}
        </div>

        <div className="border-t pt-3">
          <p className="text-primary text-2xl font-bold">{formatPrice(vehicle.preco)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export { VehicleCard };
