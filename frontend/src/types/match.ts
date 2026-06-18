export interface Match {
  id: number;

  sport: string;

  homeTeam: string;

  awayTeam: string;

  status:
    | "scheduled"
    | "live"
    | "finished";

  startTime: string;

  endTime: string;

  homeScore: number;

  awayScore: number;

  createdAt: string;
}

