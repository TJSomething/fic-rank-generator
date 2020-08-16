export interface Fic {
  title: string;

  recommendations: number;

  derecommendations: number;

  netRecommendations: number;

  score: number;

  url: string | null;

  textBody: string;

  htmlBody: string;
}
