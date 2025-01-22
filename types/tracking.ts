export interface TrackingData {
    timestamp: number;
    domain: string;
    duration: number;
  }
  
  export interface DailyStats {
    date: string;
    totalTime: number;
    sitesVisited: {
      [domain: string]: number;
    };
  }