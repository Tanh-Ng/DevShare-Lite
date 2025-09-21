'use client';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rectangular' | 'circular' | 'card';
    width?: string | number;
    height?: string | number;
    lines?: number;
}

export default function LoadingSkeleton({
    className = '',
    variant = 'rectangular',
    width,
    height,
    lines = 1
}: SkeletonProps) {
    const baseClasses = 'skeleton rounded';

    const variantClasses = {
        text: 'h-4',
        rectangular: 'h-4',
        circular: 'rounded-full',
        card: 'h-32'
    };

    const style = {
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    };

    if (variant === 'text' && lines > 1) {
        return (
            <div className={className}>
                {Array.from({ length: lines }).map((_, index) => (
                    <div
                        key={index}
                        className={`${baseClasses} ${variantClasses[variant]} ${index === lines - 1 ? 'w-3/4' : 'w-full'
                            } ${index > 0 ? 'mt-2' : ''}`}
                        style={index === lines - 1 ? { ...style, width: '75%' } : style}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
}

// Pre-built skeleton components for common use cases
export function PostCardSkeleton() {
    return (
        <div className="rounded-xl bg-card border border-border p-5 shadow-md animate-fade-in">
            <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                    {/* Author */}
                    <div className="flex items-center gap-2 mb-1">
                        <LoadingSkeleton variant="circular" width={28} height={28} />
                        <LoadingSkeleton variant="text" width={80} height={16} />
                        <LoadingSkeleton variant="text" width={60} height={16} />
                    </div>

                    {/* Title */}
                    <LoadingSkeleton variant="text" width="90%" height={24} className="mb-2" />

                    {/* Content */}
                    <LoadingSkeleton variant="text" lines={2} className="mb-3" />

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <LoadingSkeleton variant="text" width={40} height={16} />
                            <LoadingSkeleton variant="text" width={30} height={16} />
                            <LoadingSkeleton variant="text" width={30} height={16} />
                        </div>
                        <LoadingSkeleton variant="text" width={60} height={32} />
                    </div>
                </div>

                {/* Cover Image */}
                <LoadingSkeleton variant="card" width={160} height={96} />
            </div>
        </div>
    );
}

export function CommentSkeleton() {
    return (
        <div className="flex gap-3 p-4 border-b border-border last:border-b-0">
            <LoadingSkeleton variant="circular" width={40} height={40} />
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <LoadingSkeleton variant="text" width={100} height={16} />
                    <LoadingSkeleton variant="text" width={60} height={14} />
                </div>
                <LoadingSkeleton variant="text" lines={2} />
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                    <LoadingSkeleton variant="circular" width={120} height={120} />
                </div>
                <div className="flex-1">
                    <LoadingSkeleton variant="text" width={200} height={32} className="mb-2" />
                    <LoadingSkeleton variant="text" width={300} height={20} className="mb-4" />
                    <LoadingSkeleton variant="text" lines={3} />
                </div>
            </div>
        </div>
    );
}
