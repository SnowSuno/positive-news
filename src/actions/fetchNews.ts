'use client';
import assert from 'assert';
import { fetchNewsServer } from './fetchNewsServer';
import { z } from 'zod';
import { truncate } from 'fs';

export const urlSchema = z
  .string()
  .url({ message: '올바른 URL 형식이 아닙니다. ' })
  .startsWith('https://n.news.naver.com/', { message: '네이버 뉴스 URL을 입력해 주세요' });

export async function fetchNews(url: string) {
  const parsedURL = await urlSchema.parseAsync(url);

  const data = await fetchNewsServer(parsedURL);

  const html = new DOMParser().parseFromString(data, 'text/html');

  const title = html.getElementById('title_area')?.innerText.trim();
  const content = html.getElementById('dic_area')?.innerText.trim();

  if (!title || !content) {
    throw new Error('뉴스 제목과 내용을 가져오는데 실패했습니다.');
  }

  const textContent = `${title}\n${content}`;

  return {
    title: title,
    content: content.slice(0, 999 - title.length),
    textContent: textContent.slice(0, 999),
    truncated: textContent.length > 999,
  };
}
