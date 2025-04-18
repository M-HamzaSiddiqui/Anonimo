declare module "vader-sentiment" {
    export function SentimentIntensityAnalyzer(): {
      polarity_scores: (text: string) => { pos: number; neu: number; neg: number; compound: number };
    };
  }
  