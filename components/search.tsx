"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchStore } from "@/stores/search-store";
import { type BlogMdxNode } from "@/lib/mdx-sources";
import { getTagsWithCount, searchPosts } from "@/lib/search";
import { parseDate } from "@/lib/datetime";
import Link from "next/link";
import clsx from "clsx";
import { ChevronUp, X } from "lucide-react";

type SearchProps = {
  posts: BlogMdxNode[];
};

export function Search({ posts }: SearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isSearching = useSearchStore((state) => state.isSearching);
  const toggleSearch = useSearchStore((state) => state.toggleSearch);

  useEffect(() => {
    isSearching && inputRef.current?.focus();
  }, [isSearching]);

  const sortedPosts = useMemo(() => searchPosts(query, posts), [query, posts]);

  const sortedTags = useMemo(() => getTagsWithCount(posts), [posts]);

  if (!isSearching) return null;

  return (
    <section className="fixed left-1/2 top-1/2 z-50 flex h-fit max-h-[600px] w-4/5 max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-md border border-slate-600 bg-slate-200 bg-opacity-70 p-4 backdrop-blur dark:border-slate-500 dark:bg-slate-800 dark:bg-opacity-70">
      <div className="mb-2 flex h-fit flex-row items-center">
        <input
          ref={inputRef}
          type="text"
          className={clsx(
            sortedPosts.length > 0 ? "text-2xl" : "text-4xl",
            "w-full rounded border border-slate-400 bg-slate-100 px-2 text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
          )}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className={clsx(
              sortedPosts.length > 0 ? "top-5" : "top-6",
              "absolute right-14 text-slate-500 dark:text-slate-400"
            )}
          >
            <X className="h-6 w-6" />
          </button>
        )}
        <button onClick={toggleSearch}>
          <ChevronUp
            className="ml-2 h-6 w-6 text-slate-400 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
            aria-label="Close Search"
          />
        </button>
      </div>

      <ul className="flex flex-col overflow-scroll pb-2 pr-4">
        {sortedPosts.map((post) => {
          const { formattedDate, relativeTime } = parseDate(
            post.frontmatter.date
          );

          return (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="flex h-fit flex-col rounded py-2 px-8 transition-none even:bg-slate-300 even:bg-opacity-60 hover:bg-slate-500 hover:bg-opacity-60 dark:even:bg-slate-600 dark:even:bg-opacity-60 dark:hover:bg-slate-400 dark:hover:bg-opacity-60"
              onClick={toggleSearch}
            >
              <span className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                {highlightSearchQuery(query, post.frontmatter.title)}
              </span>
              <span className="text-base text-slate-600 dark:text-slate-300">
                {highlightSearchQuery(query, post.frontmatter.excerpt)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {formattedDate} • {relativeTime}
              </span>
            </Link>
          );
        })}
      </ul>

      {sortedPosts.length > 0 && <hr className="mt-2 border-slate-600" />}

      <div
        className={clsx(
          sortedPosts.length > 0 ? "sm:text-base" : "sm:text-lg",
          "flex h-fit flex-row flex-wrap items-center justify-center space-x-4 text-sm"
        )}
      >
        {sortedTags.map(([tag, count]) => (
          <button key={tag} onClick={() => setQuery(tag)}>
            <span className="text-rose-600 hover:text-rose-400 dark:text-rose-400 dark:hover:text-rose-600">
              #{tag}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              {" "}
              ({count})
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function highlightSearchQuery(query: string, text: string) {
  return text.split(new RegExp(`(${query})`, "gi")).map((part, i) => (
    <span
      key={i}
      className={part.toLowerCase() === query.toLowerCase() ? "font-bold" : ""}
    >
      {part}
    </span>
  ));
}
