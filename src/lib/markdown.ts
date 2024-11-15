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

export type FolderNode = {
  id: string;
  name: string;
  type: "folder";
  path: string;
  children: TreeNode[];
};

export type FileNode = {
  id: string;
  name: string;
  type: "file";
  path: string;
};

export type TreeNode = FileNode | FolderNode;

// content/posts 디렉토리의 모든 마크다운 파일 경로를 재귀적으로 수집
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

// slug로 포스트를 찾아 마크다운을 HTML로 변환
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  try {
    const realSlug = slug.replace(/\.mdx?$/, "");
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    // 마크다운을 HTML로 변환하는 파이프라인
    const processedContent = await unified()
      .use(remarkParse) // 마크다운 텍스트를 파싱
      .use(remarkGfm) // GitHub Flavored Markdown 지원 (표, 체크리스트 등)
      .use(remarkMath) // 수학 수식 파싱 ($$, $ 등)
      .use(remarkRehype, { allowDangerousHtml: true }) // 마크다운 AST를 HTML AST로 변환
      .use(rehypeRaw) // 원본 HTML 태그 허용
      .use(rehypeKatex) // 수학 수식을 KaTeX로 렌더링
      .use(rehypePrism) // 코드 블록 구문 강조
      .use(rehypeStringify) // HTML AST를 문자열로 변환
      .process(content);

    return {
      slug: realSlug, // URL 식별자
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

// 유효한 모든 포스트를 최신순으로 정렬하여 반환
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

// 포스트들의 카테고리를 기반으로 트리 구조 생성
export const generateCategoryTree = (posts: Post[]): TreeNode[] => {
  // 중간 변환을 위한 타입 정의
  type IntermediateNode = {
    id: string;
    name: string;
    type: "folder" | "file";
    path: string;
    children?: Record<string, IntermediateNode>;
  };

  const tree: Record<string, IntermediateNode> = {};

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
      current = current[category].children ?? {};
    });

    // 파일 노드 추가
    current[post.title] = {
      id: post.slug,
      name: post.title,
      type: "file",
      path: `/posts/${post.slug}`,
    };
  });

  // 중간 노드 객체를 최종 트리 배열로 변환
  const convertToArray = (
    nodeMap: Record<string, IntermediateNode>
  ): TreeNode[] => {
    return Object.values(nodeMap).map((node): TreeNode => {
      if (node.type === "folder") {
        return {
          id: node.id,
          name: node.name,
          type: "folder",
          path: node.path,
          children: node.children ? convertToArray(node.children) : [],
        };
      }
      return {
        id: node.id,
        name: node.name,
        type: "file",
        path: node.path,
      };
    });
  };

  return convertToArray(tree);
};
