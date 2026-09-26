export interface EventItem {
  id: string;
  troopId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  createdAt?: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  saveToDeviceCalendar: boolean;
}
