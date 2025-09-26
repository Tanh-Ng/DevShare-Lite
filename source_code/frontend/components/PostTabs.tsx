'use client';

import { Bookmark, Users, Clock } from 'lucide-react';

type Tab = 'following' | 'latest' | 'recent';

type Props = {
    currentTab: Tab;
    onTabChange: (tab: Tab) => void;
};

const tabs = [
    { key: 'latest' as Tab, label: 'Latest Posts', icon: Clock },
    { key: 'following' as Tab, label: 'Following', icon: Users },
    { key: 'recent' as Tab, label: 'Bookmarks', icon: Bookmark },
];

export default function PostTabs({ currentTab, onTabChange }: Props) {
    return (
        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-8">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`
                        flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                        ${currentTab === tab.key
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                        }
                    `}
                >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
