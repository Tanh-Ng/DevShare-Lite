// components/PostTabs.tsx
type Tab = 'following' | 'latest' | 'recent';

type Props = {
    currentTab: Tab;
    onTabChange: (tab: Tab) => void;
};

export default function PostTabs({ currentTab, onTabChange }: Props) {
    return (
        <div className="flex gap-4 mb-6 border-b border-border">
            {(['following', 'latest', 'recent'] as Tab[]).map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`pb-2 text-sm font-medium capitalize ${currentTab === tab
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-muted-foreground'
                        }`}
                >
                    {tab === 'recent' ? 'Recently Read' : tab === 'latest' ? 'Latest Posts' : 'Following'}
                </button>
            ))}
        </div>
    );
}
