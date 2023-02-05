import { type Metadata } from 'next/types';
import { allPosts } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

import { blogConfig } from '@/config';
import { PostPaginator } from '@/components/post-paginator';

const title = `${blogConfig.title} | Posts`;

const ogImage = {
  url: `${blogConfig.url}/api/og?title=Posts`,
};

export const metadata: Metadata = {
  title,
  description: blogConfig.descriptions.posts,
  openGraph: {
    type: 'website',
    url: `${blogConfig.url}/posts`,
    title: { absolute: title },
    description: blogConfig.descriptions.posts,
    images: [ogImage],
  },
  twitter: {
    title,
    description: blogConfig.descriptions.posts,
    images: ogImage,
    card: 'summary_large_image',
  },
};

export default function PostsPage() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );

  return (
    <div className="h-full px-6 pb-12 sm:px-12">
      <PostPaginator posts={posts} />
    </div>
  );
}
