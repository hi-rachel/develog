import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { generateCategoryTree, getAllPosts } from "@/lib/markdown";
import FolderTree from "@/components/FolderTree";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Develog",
  description: "프론트엔드 개발 이야기",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const posts = await getAllPosts();
  const folderStructure = generateCategoryTree(posts);

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen">
          <aside className="w-64 border-r p-4 hidden md:block">
            <FolderTree items={folderStructure} />
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
