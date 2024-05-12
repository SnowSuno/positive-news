'use server';

import { env } from '@/env';
import ky from 'ky';

interface CommonSentiment {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

interface SentenceSentiment extends CommonSentiment {
  content: string;
  offset: number;
  length: number;
  highlights: { offset: number; length: number }[];
}

interface APIResponse {
  document: CommonSentiment;
  sentences: SentenceSentiment[];
}

export async function analyzeSentiment(content: string) {
  console.log(env.NAVER_API_KEY_ID, env.NAVER_API_KEY);
  const data = await ky
    .post('https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze', {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': env.NAVER_API_KEY_ID,
        'X-NCP-APIGW-API-KEY': env.NAVER_API_KEY,
      },
      json: {
        content,
      },
    })
    .json<APIResponse>();

  return data;
}
