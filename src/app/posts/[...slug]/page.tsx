import { getPostBySlug, getPostSlugs } from "@/lib/markdown";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";

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
    <article className="max-w-4xl mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <div className="flex gap-4 text-gray-500">
          <time dateTime={post.date}>
            {format(new Date(post.date), "yyyy년 MM월 dd일")}
          </time>
          <div>{post.category}</div>
        </div>
        {post.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      <div
        className="prose prose-lg dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};

export default PostPage;
