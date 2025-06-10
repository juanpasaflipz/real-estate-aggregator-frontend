export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Departamento' },
  { value: 'house', label: 'Casa' },
  { value: 'condo', label: 'Condominio' },
  { value: 'land', label: 'Terreno' },
  { value: 'commercial', label: 'Comercial' },
] as const;

export const PROPERTY_FEATURES = [
  { value: 'pool', label: 'Alberca' },
  { value: 'garage', label: 'Cochera' },
  { value: 'garden', label: 'Jardín' },
  { value: 'gym', label: 'Gimnasio' },
  { value: 'security', label: 'Seguridad' },
  { value: 'elevator', label: 'Elevador' },
  { value: 'terrace', label: 'Terraza' },
  { value: 'furnished', label: 'Amueblado' },
] as const;

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Más relevantes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'date', label: 'Más recientes' },
] as const;

export const DEFAULT_PAGE_SIZE = 20;

export const PRICE_RANGES = [
  { min: 0, max: 1000000, label: 'Hasta $1M' },
  { min: 1000000, max: 2000000, label: '$1M - $2M' },
  { min: 2000000, max: 5000000, label: '$2M - $5M' },
  { min: 5000000, max: 10000000, label: '$5M - $10M' },
  { min: 10000000, max: null, label: 'Más de $10M' },
] as const;