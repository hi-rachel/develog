import { Post } from "@/lib/markdown";
import Link from "next/link";
import { format } from "date-fns";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="border rounded-lg p-3 md:p-4 hover:shadow-lg transition">
      <Link href={`/posts/${post.slug.replace(/\.mdx?$/, "")}`}>
        <h2 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">
          {post.title}
        </h2>
        <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base line-clamp-2 md:line-clamp-3">
          {post.description}
        </p>
        <div className="flex flex-wrap justify-between text-xs md:text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <span>{format(new Date(post.date), "yyyy.MM.dd")}</span>
            <span className="font-medium">Develog</span>
          </div>
          <span>{post.category}</span>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
