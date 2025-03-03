import PostCard from "@/components/post/PostCard";
import { getAllPosts } from "@/lib/markdown";

const Home = async () => {
  const posts = await getAllPosts();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">최신 포스트</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
