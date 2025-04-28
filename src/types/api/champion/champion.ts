{
  /* TODO: 추후 프로필 쪽 csPerMinute, wins 값 들어오면 수정 */
}
export interface ChampionResponseDTO {
  championId: number;
  championName: string;
  csPerMinute?: number;
  games: number;
  winRate: number;
  wins?: number;
}
