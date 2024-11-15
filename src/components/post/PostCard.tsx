import { Post } from "@/lib/markdown";
import Link from "next/link";
import { format } from "date-fns";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <Link href={`/posts/${post.slug.replace(/\.mdx?$/, "")}`}>
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.description}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{format(new Date(post.date), "yyyy.MM.dd")}</span>
          <span>{post.category}</span>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
