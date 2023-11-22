interface Place {
  _id: string;
  region: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
  numberHearts: number;
  is_landmark: boolean;
  tags: string[];
  tourismInfo: TourismInfo;
}

interface TourismInfo {
  busInfo: {
    busRoutes: string[];
    busStops: string[];
  };
  admissionFee: number;
  closedDays: string[];
  subwayInfo: string[];
}
