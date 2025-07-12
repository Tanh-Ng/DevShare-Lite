// utils/cloudinary.ts

/**
 * Tạo URL ảnh tối ưu từ Cloudinary với kích thước và chất lượng mong muốn.
 * @param originalUrl - URL gốc từ Cloudinary
 * @param width - Chiều rộng mong muốn
 * @param height - Chiều cao mong muốn
 * @returns URL đã thêm tham số tối ưu hóa
 */
export function getOptimizedImageUrl(originalUrl: string, width: number, height: number): string {
    const uploadIndex = originalUrl.indexOf('/upload/');
    if (uploadIndex === -1) return originalUrl;

    const transformation = `w_${width},h_${height},c_fill,q_auto,f_auto`;

    return (
        originalUrl.slice(0, uploadIndex + 8) +
        transformation +
        '/' +
        originalUrl.slice(uploadIndex + 8)
    );
}

/**
 * Shortcut: Tạo ảnh bìa kích thước 1280x720
 */
export function getCoverImageUrl(originalUrl: string): string {
    return getOptimizedImageUrl(originalUrl, 1280, 720);
}

/**
 * Shortcut: Tạo ảnh đại diện kích thước 200x200
 */
export function getAvatarImageUrl(originalUrl: string): string {
    return getOptimizedImageUrl(originalUrl, 128, 128);
}