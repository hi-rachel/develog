"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Folder, FileText } from "lucide-react";
import Link from "next/link";

interface FolderItem {
  id: string;
  name: string;
  type: "folder" | "file";
  path: string;
  children?: FolderItem[];
}

interface FolderTreeProps {
  items: FolderItem[];
}

const FolderTree = ({ items }: FolderTreeProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleFolder = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = (item: FolderItem, level = 0) => {
    const paddingLeft = `${level * 1}rem`;

    return (
      <div key={item.id} style={{ paddingLeft }}>
        {item.type === "folder" ? (
          <div>
            <button
              onClick={() => toggleFolder(item.id)}
              className="flex items-center gap-2 w-full hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md"
            >
              {expanded[item.id] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <Folder className="w-4 h-4 text-violet-600" />
              <span className="text-sm">{item.name}</span>
            </button>
            {expanded[item.id] && item.children && (
              <div className="ml-2">
                {item.children.map((child) => renderItem(child, level + 1))}
              </div>
            )}
          </div>
        ) : (
          <Link href={item.path}>
            <div className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-md">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{item.name}</span>
            </div>
          </Link>
        )}
      </div>
    );
  };

  return <div className="w-full">{items.map((item) => renderItem(item))}</div>;
};

export default FolderTree;
