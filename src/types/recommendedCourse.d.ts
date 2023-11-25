interface RecommendedCourse {
  _id: string;
  courseName: string;
  user: string;
  places: Place[];
  travelTime: number[];
  totalFee: number;
  recordImages: string[];
  mainRecordImageIndex: number;
  isProgress: boolean;
  isTermination: boolean;
  isRecommended: boolean;
}
