'use client';

type Tab = 'following' | 'latest' | 'recent';

type Props = {
    currentTab: Tab;
    onTabChange: (tab: Tab) => void;
};

const tabs = [
    { key: 'latest' as Tab, label: 'Latest Posts', icon: '📝' },
    { key: 'following' as Tab, label: 'Following', icon: '👥' },
    { key: 'recent' as Tab, label: 'Bookmarks', icon: '🔖' },
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
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
