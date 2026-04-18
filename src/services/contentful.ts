import * as contentful from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const client = contentful.createClient({
  space:       import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchEntries<T>(contentType: string): Promise<T[]> {
  const res = await client.getEntries<contentful.EntrySkeletonType>({
    content_type: contentType,
  });
  return res.items.map(item => item.fields as T);
}

export async function fetchEntry<T>(contentType: string, slug: string): Promise<T> {
  const res = await client.getEntries<contentful.EntrySkeletonType>({
    content_type: contentType,
    'fields.slug': slug,
    limit: 1,
  });
  if (!res.items.length) throw new Error(`Entry not found: ${slug}`);
  return res.items[0].fields as T;
}

export { documentToHtmlString };
