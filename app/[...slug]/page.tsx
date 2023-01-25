import '@/styles/markdown.css';
import { allPages } from 'contentlayer/generated';
import { MdxContent } from '@/components/mdx-content';
import { notFound } from 'next/navigation';

type PageProps = {
  params: {
    slug: string[];
  };
};

export async function generateStaticParams(): Promise<PageProps['params'][]> {
  return allPages.map(({ slug }) => ({
    slug: slug.split('/'),
  }));
}

export default async function Page({ params }: PageProps) {
  const page = allPages.find(({ slug }) => slug === params.slug.join('/'));

  if (!page) {
    notFound();
  }

  return (
    <div className="h-full px-8">
      <MdxContent code={page.body.code} />
    </div>
  );
}
