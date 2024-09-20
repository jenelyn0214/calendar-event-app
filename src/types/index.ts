
export interface CalendarEvent {
    end_time?: string | number | Date;
    start_time?: string | number | Date;
    id: string;
    title: string;
    start: Date;
    end: Date;
    description: string;
    organizationId: string;
  }

  export interface CalendarEventData {
    end_time?: string | number | Date;
    start_time?: string | number | Date;
    end?: string | number | Date;
    start?: string | number | Date;
    title: string;
    description: string;
  }

  export interface Organization {
      id: number;
      name: string;
  }

  export interface User { 
    email: string; 
    password: string; 
    full_name: string; 
    organization: number;
}

export interface UserCredentials  { 
    email: string; 
    password: string 
}