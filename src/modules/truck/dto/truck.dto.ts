export interface ITruck {
  vin_code: string;
  plate_number: string;
  year: string;
  brand: string;
  model: string;
  load_capacity: number;
  car_capacity: number;
  inspection_date: string;
  mileage: number;
  status: string;
  id?: number;
}
