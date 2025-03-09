import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { generateCategoryTree, getAllPosts } from "@/lib/markdown";
import FolderTree from "@/components/FolderTree";
import SidebarController from "@/components/SidebarController";
import Link from "next/link";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Develog",
  description: "Raina's Technology Blog",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const posts = await getAllPosts();
  const folderStructure = generateCategoryTree(posts);
  const currentYear = new Date().getFullYear();

  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} font-pretendard antialiased flex flex-col min-h-screen suppressHydrationWarning`}
      >
        {/* 헤더 - 모든 화면 크기에서 표시 */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b w-full">
          <div className="flex justify-between items-center h-14 px-4">
            {/* Develog 로고 */}
            <div>
              <Link href="/" className="flex items-center">
                <div className="text-xl font-bold">
                  <span style={{ color: "#5a67d8" }}>&lt;</span>
                  <span style={{ color: "#5a67d8" }}>Deve</span>
                  <span style={{ color: "#7c3aed" }}>log</span>
                  <span style={{ color: "#5a67d8" }}>/&gt;</span>
                </div>
              </Link>
            </div>

            {/* 모바일 전용 메뉴 버튼 */}
            <button
              id="mobile-menu-button"
              className="md:hidden text-gray-600 dark:text-gray-300"
              aria-label="메뉴 토글"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row flex-1 relative">
          {/* 사이드바 - 수정된 기본 상태 */}
          <aside
            id="sidebar"
            className="w-64 border-r p-4 
            fixed left-0 bg-white dark:bg-gray-900 z-30 
            transform transition-transform duration-300 ease-in-out 
            translate-x-[-100%] md:translate-x-0
            top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
            style={{ opacity: "0.95" }} // 약간 투명하게 설정
          >
            <div className="flex flex-col h-full">
              {/* 모바일 전용 닫기 버튼 */}
              <button
                id="close-sidebar-button"
                className="md:hidden absolute top-2 right-2 p-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="사이드바 닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <FolderTree items={folderStructure} />
            </div>
          </aside>

          {/* 메인 콘텐츠 영역 - 중앙 정렬을 위한 스타일 추가 */}
          <main className="flex-1 md:ml-64 max-w-full overflow-x-hidden transition-all duration-300 px-4 mx-auto">
            {children}
          </main>
        </div>

        {/* 푸터 */}
        <footer className="bg-white dark:bg-gray-900 border-t py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                © {currentYear} Raina. All rights reserved.
              </div>
              <div className="flex space-x-4">
                <Link
                  href="https://github.com/hi-rachel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </Link>
                <Link
                  href="https://velog.io/@hi-rachel/posts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="4"
                      ry="4"
                      fill="currentColor"
                    />
                    <path
                      d="M7.5 8.5L12 15.5L16.5 8.5"
                      stroke="white"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>

        {/* 사이드바 제어 컴포넌트 */}
        <SidebarController />
      </body>
    </html>
  );
};

export default RootLayout;
