import {Trip} from "./googleMapsApi";

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
};
