export interface ChampionResponseDTO {
  championId: number;
  championName: string;
  csPerMinute?: number;
  games: number;
  winRate: number;
  wins?: number;
  kda: number;
  kills: number;
  deaths: number;
  assists: number;
  averageCs: number;
}
