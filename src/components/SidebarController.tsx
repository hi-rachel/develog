"use client";

import { useEffect, useState } from "react";

const SidebarController = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    const overlay = document.getElementById("sidebar-overlay") as HTMLElement;
    const hoverIndicator = document.getElementById(
      "sidebar-hover-indicator"
    ) as HTMLElement;
    const mainContent = document.querySelector("main") as HTMLElement;

    setIsSidebarOpen(!isSidebarOpen);

    if (sidebar) {
      if (sidebar.classList.contains("translate-x-[-100%]")) {
        // 사이드바 열기
        sidebar.classList.remove("translate-x-[-100%]", "sidebar-hidden");
        sidebar.classList.add("translate-x-0");
        sidebar.style.visibility = "visible";
        sidebar.style.opacity = "0.95"; // 약간 투명하게 설정

        // 메인 컨텐츠 조정
        if (mainContent && window.innerWidth >= 768) {
          mainContent.classList.remove("md:ml-0");
          mainContent.classList.add("md:ml-64");
          // 컨텐츠를 중앙 정렬
          mainContent.style.margin = "0 auto";
          mainContent.style.maxWidth = "calc(100% - 64px)";
        }

        // 모바일에서 오버레이 표시
        if (window.innerWidth < 768 && overlay) {
          overlay.classList.remove("hidden");
        }

        // 호버 인디케이터 숨기기
        if (hoverIndicator && window.innerWidth >= 768) {
          hoverIndicator.style.opacity = "0";
          hoverIndicator.style.pointerEvents = "none";
        }
      } else {
        // 사이드바 닫기
        sidebar.classList.add("translate-x-[-100%]", "sidebar-hidden");
        sidebar.classList.remove("translate-x-0");

        // 메인 컨텐츠 조정
        if (mainContent && window.innerWidth >= 768) {
          mainContent.classList.remove("md:ml-64");
          mainContent.classList.add("md:ml-0");
          // 컨텐츠를 중앙 정렬
          mainContent.style.margin = "0 auto";
          mainContent.style.maxWidth = "100%";
        }

        // 애니메이션 완료 후 사이드바 숨기기
        setTimeout(() => {
          if (sidebar && sidebar.classList.contains("sidebar-hidden")) {
            sidebar.style.visibility = "hidden";

            // 오버레이 숨기기
            if (overlay) {
              overlay.classList.add("hidden");
            }

            // 호버 인디케이터 표시
            if (hoverIndicator && window.innerWidth >= 768) {
              hoverIndicator.style.opacity = "0";
              hoverIndicator.style.pointerEvents = "auto";
            }
          }
        }, 300);
      }
    }
  };

  // 호버 기반 사이드바 제어
  const handleMouseEnter = () => {
    setIsHovering(true);
    const hoverIndicator = document.getElementById("sidebar-hover-indicator");
    if (hoverIndicator && window.innerWidth >= 700) {
      hoverIndicator.style.opacity = "0.7";
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    const hoverIndicator = document.getElementById("sidebar-hover-indicator");
    if (hoverIndicator && window.innerWidth >= 700 && !isSidebarOpen) {
      hoverIndicator.style.opacity = "0";
    }
  };

  // 호버 기반 사이드바 열기
  const handleHoverOpen = () => {
    if (window.innerWidth >= 700 && !isSidebarOpen) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    // 호버 인디케이터 요소 생성
    let hoverIndicator = document.getElementById("sidebar-hover-indicator");
    if (!hoverIndicator) {
      hoverIndicator = document.createElement("div");
      hoverIndicator.id = "sidebar-hover-indicator";
      hoverIndicator.className = "sidebar-hover-indicator";
      document.body.appendChild(hoverIndicator);
    }

    // 사이드바 상태에 따라 컨트롤 탭 위치 조정
    const sidebarControlTab = document.querySelector(
      ".sticky-sidebar-tab"
    ) as HTMLElement;
    if (sidebarControlTab) {
      if (isSidebarOpen) {
        sidebarControlTab.style.left = "16rem"; // 사이드바 너비와 일치
      } else {
        sidebarControlTab.style.left = "0";
      }
    }

    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const closeSidebarButton = document.getElementById("close-sidebar-button");
    const sidebar = document.getElementById("sidebar") as HTMLElement;
    const overlay = document.getElementById("sidebar-overlay") as HTMLElement;
    const mainContent = document.querySelector("main") as HTMLElement;

    // 오버레이 생성
    if (!overlay) {
      const newOverlay = document.createElement("div");
      newOverlay.id = "sidebar-overlay";
      newOverlay.className = "fixed inset-0 bg-black bg-opacity-50 z-20 hidden";
      document.body.appendChild(newOverlay);
    }

    // 화면 크기에 따른 초기 상태 설정
    const handleResize = () => {
      if (window.innerWidth >= 700) {
        // 데스크톱: 사이드바는 기본적으로 열려있음
        if (sidebar && isSidebarOpen) {
          sidebar.classList.remove("translate-x-[-100%]", "sidebar-hidden");
          sidebar.classList.add("translate-x-0");
          sidebar.style.visibility = "visible";
          sidebar.style.opacity = "0.95"; // 약간 투명하게 설정

          // 메인 컨텐츠 조정
          if (mainContent) {
            mainContent.classList.remove("md:ml-0");
            mainContent.classList.add("md:ml-64");
            // 컨텐츠를 중앙 정렬
            mainContent.style.margin = "0 auto";
            mainContent.style.maxWidth = "calc(100% - 64px)";
          }
        } else if (sidebar && !isSidebarOpen) {
          // 메인 컨텐츠 조정 (사이드바 닫힘)
          if (mainContent) {
            mainContent.classList.remove("md:ml-64");
            mainContent.classList.add("md:ml-0");
            // 컨텐츠를 중앙 정렬
            mainContent.style.margin = "0 auto";
            mainContent.style.maxWidth = "100%";
          }
        }

        // 호버 인디케이터는 사이드바가 닫혀있을 때만 표시
        if (hoverIndicator) {
          if (isSidebarOpen) {
            hoverIndicator.style.opacity = "0";
            hoverIndicator.style.pointerEvents = "none";
          } else {
            hoverIndicator.style.opacity = isHovering ? "0.7" : "0";
            hoverIndicator.style.pointerEvents = "auto";
          }
        }
      } else {
        // 모바일/태블릿: 사이드바는 기본적으로 닫혀있음
        if (!isSidebarOpen && sidebar) {
          sidebar.classList.add("translate-x-[-100%]", "sidebar-hidden");
          sidebar.classList.remove("translate-x-0");
          sidebar.style.visibility = "hidden";
        }

        // 모바일에서는 호버 인디케이터 숨김
        if (hoverIndicator) {
          hoverIndicator.style.opacity = "0";
          hoverIndicator.style.pointerEvents = "none";
        }

        // 메인 컨텐츠 모바일 스타일
        if (mainContent) {
          mainContent.style.margin = "0";
          mainContent.style.maxWidth = "100%";
        }
      }
    };

    // 이벤트 리스너 설정
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener("click", toggleSidebar);
    }

    if (closeSidebarButton) {
      closeSidebarButton.addEventListener("click", toggleSidebar);
    }

    if (hoverIndicator) {
      hoverIndicator.addEventListener("mouseenter", handleHoverOpen);
    }

    if (overlay) {
      overlay.addEventListener("click", toggleSidebar);
    }

    // 사이드바 외부 클릭 시 닫기
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        window.innerWidth >= 700 &&
        isSidebarOpen &&
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        !(e.target as Element)?.closest(".sticky-sidebar-tab") &&
        !hoverIndicator?.contains(e.target as Node)
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener("click", handleOutsideClick);

    // 초기 상태 설정
    handleResize();

    // 리사이즈 이벤트 리스너
    window.addEventListener("resize", handleResize);

    // 클린업
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleOutsideClick);

      if (mobileMenuButton) {
        mobileMenuButton.removeEventListener("click", toggleSidebar);
      }

      if (closeSidebarButton) {
        closeSidebarButton.removeEventListener("click", toggleSidebar);
      }

      if (hoverIndicator) {
        hoverIndicator.removeEventListener("mouseenter", handleHoverOpen);
      }

      if (overlay) {
        overlay.removeEventListener("click", toggleSidebar);
      }
    };
  }, [isSidebarOpen, isHovering]);

  // 큰 화면에서 사이드바 제어 버튼 표시
  return (
    <div
      className="fixed left-64 top-20 z-40 hidden lg:flex sticky-sidebar-tab"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        aria-label={isSidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
        onClick={toggleSidebar}
        className="flex items-center justify-center w-6 h-16 bg-indigo-600 bg-opacity-90 text-white rounded-r-md shadow-md hover:bg-indigo-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-300 ${
            isSidebarOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isSidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          )}
        </svg>
      </button>
    </div>
  );
};

export default SidebarController;
