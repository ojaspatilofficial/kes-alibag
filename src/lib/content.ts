// Loads website content from the MongoDB-backed API.
// Pages render the built-in content from src/data/ immediately, then switch to the database version
// when it arrives. If the API is offline, the built-in content stays.
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { institutions as builtInInstitutions } from '../data/institutions';
import { board, defaultSettings, documents, gallery, leaders, notices, timeline } from '../data/site';
import type { BoardMember, DocumentItem, GalleryItem, Institution, Leader, NoticeItem, SiteSettings, TimelineItem } from '../data/types';

interface ResourceMap {
  institutions: Institution;
  boardMembers: BoardMember;
  leaders: Leader;
  timeline: TimelineItem;
  notices: NoticeItem;
  documents: DocumentItem;
  gallery: GalleryItem;
}
export type ResourceKey = keyof ResourceMap;

const fallbacks: { [K in ResourceKey]: ResourceMap[K][] } = {
  institutions: builtInInstitutions,
  boardMembers: board,
  leaders,
  timeline,
  notices,
  documents,
  gallery,
};

const cache = new Map<string, Promise<unknown[]>>();
const resolved = new Map<string, unknown[]>();

function load<K extends ResourceKey>(key: K): Promise<ResourceMap[K][]> {
  if (!cache.has(key)) {
    const p = api
      .get<ResourceMap[K][]>(`/content/${key}`)
      .then((items) => {
        resolved.set(key, items);
        return items;
      })
      .catch(() => {
        cache.delete(key);
        return fallbacks[key];
      });
    cache.set(key, p as Promise<unknown[]>);
  }
  return cache.get(key) as Promise<ResourceMap[K][]>;
}

export const clearContentCache = () => {
  cache.clear();
  resolved.clear();
};

/** Returns the list for a resource: built-in data first, then the database version. */
export function useContent<K extends ResourceKey>(key: K): ResourceMap[K][] {
  const [items, setItems] = useState<ResourceMap[K][]>(() => (resolved.get(key) as ResourceMap[K][]) || fallbacks[key]);
  useEffect(() => {
    let alive = true;
    load(key).then((list) => alive && setItems(list));
    return () => {
      alive = false;
    };
  }, [key]);
  return items;
}

/* -------------------------------- Settings -------------------------------- */

export const SettingsContext = createContext<SiteSettings>(defaultSettings);

export const useSettings = () => useContext(SettingsContext);

/** All institutions in display order. Each one's website is set in Admin → Institutions. */
export function useInstitutions(): Institution[] {
  const list = useContent('institutions');
  return useMemo(() => [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [list]);
}

/** Documents that actually have a file (public pages never show empty slots). */
export function usePublishedDocuments() {
  const docs = useContent('documents');
  return useMemo(() => docs.filter((d) => d.file_url), [docs]);
}

export async function submitEnquiry(payload: Record<string, string>) {
  await api.post('/forms/enquiries', payload);
}
