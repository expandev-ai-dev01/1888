import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVehicleList } from '@/domain/vehicle/hooks/useVehicleList';
import { VehicleCard } from '@/domain/vehicle/components/VehicleCard';
import { VehicleFilters } from '@/domain/vehicle/components/VehicleFilters';
import { VehicleSort } from '@/domain/vehicle/components/VehicleSort';
import { VehiclePagination } from '@/domain/vehicle/components/VehiclePagination';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { Button } from '@/core/components/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/core/components/sheet';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/core/components/empty';
import { AlertCircleIcon, CarIcon, FilterIcon, PackageXIcon } from 'lucide-react';
import type {
  VehicleFilters as VehicleFiltersType,
  VehicleListParams,
} from '@/domain/vehicle/types/vehicle';

function VehicleListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState<VehicleFiltersType>({
    brands: searchParams.get('brands')?.split(',').filter(Boolean) ?? [],
    models: searchParams.get('models')?.split(',').filter(Boolean) ?? [],
    yearMin: searchParams.get('yearMin') ? parseInt(searchParams.get('yearMin')!, 10) : undefined,
    yearMax: searchParams.get('yearMax') ? parseInt(searchParams.get('yearMax')!, 10) : undefined,
    priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
    priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
    transmissions: searchParams.get('transmissions')?.split(',').filter(Boolean) ?? [],
  });

  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') ?? 'relevance');
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') ?? '1', 10));
  const [pageSize, setPageSize] = useState<number>(
    parseInt(searchParams.get('pageSize') ?? '12', 10)
  );

  const queryParams: VehicleListParams = {
    page,
    pageSize,
    sortBy: sortBy as VehicleListParams['sortBy'],
    brands: filters.brands.length > 0 ? filters.brands.join(',') : undefined,
    models: filters.models.length > 0 ? filters.models.join(',') : undefined,
    yearMin: filters.yearMin,
    yearMax: filters.yearMax,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    transmissions: filters.transmissions.length > 0 ? filters.transmissions.join(',') : undefined,
  };

  const { vehicles, pagination, availableFilters, isLoading, isError, refetch } = useVehicleList({
    filters: queryParams,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.models.length > 0) params.set('models', filters.models.join(','));
    if (filters.yearMin) params.set('yearMin', filters.yearMin.toString());
    if (filters.yearMax) params.set('yearMax', filters.yearMax.toString());
    if (filters.priceMin) params.set('priceMin', filters.priceMin.toString());
    if (filters.priceMax) params.set('priceMax', filters.priceMax.toString());
    if (filters.transmissions.length > 0)
      params.set('transmissions', filters.transmissions.join(','));
    if (sortBy !== 'relevance') params.set('sortBy', sortBy);
    if (page !== 1) params.set('page', page.toString());
    if (pageSize !== 12) params.set('pageSize', pageSize.toString());
    setSearchParams(params);
  }, [filters, sortBy, page, pageSize, setSearchParams]);

  useEffect(() => {
    if (pagination && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [pagination, page]);

  const handleFiltersChange = (newFilters: VehicleFiltersType) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setPage(1);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      brands: [],
      models: [],
      yearMin: undefined,
      yearMax: undefined,
      priceMin: undefined,
      priceMax: undefined,
      transmissions: [],
    });
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  };

  const handleVehicleClick = (vehicleId: string) => {
    console.log('Navigate to vehicle details:', vehicleId);
  };

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.models.length > 0 ||
    filters.transmissions.length > 0 ||
    filters.yearMin !== undefined ||
    filters.yearMax !== undefined ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner className="size-12" />
          <p className="text-muted-foreground text-sm">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>Erro ao carregar veículos</AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p>Ocorreu um erro ao carregar os veículos. Por favor, tente novamente.</p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalVehicles = pagination?.total ?? 0;
  const isCatalogEmpty = totalVehicles === 0 && !hasActiveFilters;
  const isFilteredEmpty = totalVehicles === 0 && hasActiveFilters;

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Catálogo de Veículos</h1>
        <p className="text-muted-foreground">Encontre o veículo ideal para você</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="hidden w-full lg:block lg:w-80">
          <VehicleFilters
            filters={filters}
            availableBrands={availableFilters?.availableBrands}
            availableModels={availableFilters?.availableModels}
            availableTransmissions={availableFilters?.availableTransmissions}
            yearRange={availableFilters?.yearRange}
            priceRange={availableFilters?.priceRange}
            onFiltersChange={handleFiltersChange}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </aside>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-sm">
                {totalVehicles > 0 && (
                  <>
                    Exibindo {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalVehicles)}{' '}
                    de {totalVehicles} veículos
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <FilterIcon className="size-4" />
                      Filtrar
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <VehicleFilters
                        filters={filters}
                        availableBrands={availableFilters?.availableBrands}
                        availableModels={availableFilters?.availableModels}
                        availableTransmissions={availableFilters?.availableTransmissions}
                        yearRange={availableFilters?.yearRange}
                        priceRange={availableFilters?.priceRange}
                        onFiltersChange={handleFiltersChange}
                        onApply={handleApplyFilters}
                        onClear={handleClearFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <VehicleSort value={sortBy} onChange={handleSortChange} />
            </div>
          </div>

          {isCatalogEmpty && (
            <Empty className="min-h-[50vh]">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <PackageXIcon className="size-6" />
                </EmptyMedia>
                <EmptyTitle>Catálogo vazio</EmptyTitle>
                <EmptyDescription>
                  Não há veículos disponíveis no catálogo no momento. Por favor, volte mais tarde ou
                  entre em contato conosco para mais informações.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}

          {isFilteredEmpty && (
            <Empty className="min-h-[50vh]">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CarIcon className="size-6" />
                </EmptyMedia>
                <EmptyTitle>Nenhum veículo encontrado</EmptyTitle>
                <EmptyDescription>
                  Não encontramos veículos com os filtros selecionados. Tente remover alguns filtros
                  ou alterar os critérios de busca para ampliar os resultados.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={handleClearFilters} variant="outline">
                  Limpar filtros
                </Button>
              </EmptyContent>
            </Empty>
          )}

          {!isCatalogEmpty && !isFilteredEmpty && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {vehicles?.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} onClick={handleVehicleClick} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <VehiclePagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export { VehicleListPage };
