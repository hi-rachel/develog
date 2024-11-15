import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import { refractor } from "refractor";
import jsx from "refractor/lang/jsx";
import typescript from "refractor/lang/typescript";
import bash from "refractor/lang/bash";
import javascript from "refractor/lang/javascript";
import json from "refractor/lang/json";
import css from "refractor/lang/css";
import markdown from "refractor/lang/markdown";

// 언어 등록
refractor.register(jsx);
refractor.register(typescript);
refractor.register(bash);
refractor.register(javascript);
refractor.register(json);
refractor.register(css);
refractor.register(markdown);

const postsDirectory = path.join(process.cwd(), "content/posts");

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  description: string;
  tags: string[];
  content: string;
};

export const getPostSlugs = () => {
  const getAllFiles = (
    dirPath: string,
    arrayOfFiles: string[] = []
  ): string[] => {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath, arrayOfFiles);
      } else {
        const relativePath = path.relative(postsDirectory, filePath);
        if (path.extname(file) === ".md" || path.extname(file) === ".mdx") {
          arrayOfFiles.push(relativePath);
        }
      }
    });

    return arrayOfFiles;
  };

  return getAllFiles(postsDirectory);
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const realSlug = slug.replace(/\.mdx?$/, "");
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    const processedContent = await unified()
      .use(remarkParse) // markdown을 파싱
      .use(remarkGfm) // GitHub Flavored Markdown 지원
      .use(remarkMath) // 수학 수식 지원
      .use(remarkRehype, { allowDangerousHtml: true }) // markdown을 HTML로 변환
      .use(rehypeRaw) // HTML 태그 허용
      .use(rehypeKatex) // 수학 수식 렌더링
      .use(rehypePrism) // 코드 하이라이팅
      .use(rehypeStringify) // HTML을 문자열로 변환
      .process(content);

    return {
      slug: realSlug,
      title: data.title,
      date: data.date,
      category: data.category,
      description: data.description,
      tags: data.tags || [],
      content: processedContent.toString(),
    };
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
};

export const getAllPosts = async (): Promise<Post[]> => {
  const slugs = getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const slugWithoutExt = slug.replace(/\.mdx?$/, "");
      const post = await getPostBySlug(slugWithoutExt);
      return post;
    })
  );

  return posts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const generateCategoryTree = (posts: Post[]) => {
  const tree: Record<string, any> = {};

  posts.forEach((post) => {
    const categories = post.category.split("/");
    let current = tree;

    categories.forEach((category, index) => {
      if (!current[category]) {
        current[category] = {
          id: category,
          name: category,
          type: "folder",
          path: `/${categories.slice(0, index + 1).join("/")}`,
          children: {},
        };
      }
      current = current[category].children;
    });

    current[post.title] = {
      id: post.slug,
      name: post.title,
      type: "file",
      path: `/posts/${post.slug}`,
    };
  });

  const convertToArray = (obj: Record<string, any>): any[] => {
    return Object.values(obj).map((item) => ({
      ...item,
      children: item.children ? convertToArray(item.children) : undefined,
    }));
  };

  return convertToArray(tree);
};
