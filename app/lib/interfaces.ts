export interface Settings {
  key?: any;
  mode: string
  arrival_time: string;
  units: string;
  origins: string;
  destinations: string;
};


export interface Listing {
  location: string;
  id:  string;
  distance?: string;
  duration?: string;
  origin?: string;
  destination?: string;
  status?: string;
  mode?: string;
  directionsUrl?: string;
};
