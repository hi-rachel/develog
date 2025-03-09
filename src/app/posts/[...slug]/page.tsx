import { getPostBySlug, getPostSlugs } from "@/lib/markdown";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";

interface PostProps {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async ({
  params,
}: PostProps): Promise<Metadata> => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join("/");
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
};

export const generateStaticParams = async () => {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx?$/, "").split("/"),
  }));
};

const PostPage = async ({ params }: PostProps) => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join("/");
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{post.title}</h1>
        <div className="flex flex-wrap gap-2 md:gap-4 text-gray-500 text-sm md:text-base">
          <time dateTime={post.date}>
            {format(new Date(post.date), "yyyy년 MM월 dd일")}
          </time>
          <div className="font-medium">{post.author}</div>
          <div>{post.category}</div>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 md:mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs md:text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div
        className="prose prose-sm md:prose-lg max-w-none dark:prose-invert
        prose-headings:mb-3 prose-headings:mt-6
        prose-p:my-3 prose-p:leading-relaxed
        prose-pre:text-sm prose-pre:p-3"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
    </article>
  );
};

export default PostPage;
