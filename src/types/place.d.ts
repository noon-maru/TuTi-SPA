interface Place {
  _id: string;
  region: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  image: string;
  wishPlaceCount: number;
  isLandmark: boolean;
  tags: string[];
  tourismInfo: TourismInfo;
}

interface TourismInfo {
  parkingInfo: string;
  advice: string;
  admissionFee: number;
  closedDays: string[];
  subwayInfo: string[];
  busInfo: {
    busRoutes: string[];
    busStops: string[];
  };
}
