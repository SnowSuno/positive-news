'use server';

import ky from 'ky';

export async function fetchNewsServer(url: string) {
  return await ky.get(url).text();
}
