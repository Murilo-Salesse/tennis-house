// Types para o banco de dados

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings?: Booking[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  available: boolean;
  dayOfWeek?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  clientId: string;
  client?: Client;
  timeSlotId: string;
  timeSlot?: TimeSlot;
  date: Date;
  status: "pending" | "confirmed" | "cancelled";
  value: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourtImage {
  id: string;
  url: string;
  title?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Login Response
export interface LoginResponse {
  user: Omit<User, "password">;
  message: string;
}
