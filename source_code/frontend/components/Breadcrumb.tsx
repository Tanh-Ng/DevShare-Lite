'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    const router = useRouter();

    // Auto-generate breadcrumbs based on current path
    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const pathSegments = router.asPath.split('/').filter(Boolean);
        const breadcrumbs: BreadcrumbItem[] = [
            { label: 'Home', href: '/' }
        ];

        let currentPath = '';
        pathSegments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === pathSegments.length - 1;

            // Skip dynamic segments like [id]
            if (segment.startsWith('[') && segment.endsWith(']')) {
                return;
            }

            let label = segment;

            // Customize labels for specific routes
            switch (segment) {
                case 'home':
                    label = 'Dashboard';
                    break;
                case 'write':
                    label = 'Write Post';
                    break;
                case 'profile':
                    label = 'Profile';
                    break;
                case 'post':
                    if (pathSegments[index + 1]) {
                        label = 'Post Details';
                    } else {
                        label = 'Posts';
                    }
                    break;
                default:
                    label = segment.charAt(0).toUpperCase() + segment.slice(1);
            }

            breadcrumbs.push({
                label,
                href: isLast ? undefined : currentPath
            });
        });

        return breadcrumbs;
    };

    const breadcrumbs = items || generateBreadcrumbs();

    if (breadcrumbs.length <= 1) return null;

    return (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">
                    {index > 0 && (
                        <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-foreground transition-colors duration-200"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
