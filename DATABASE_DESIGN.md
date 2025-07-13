#  Thiết kế cơ sở dữ liệu – DevShare Lite

---

## 1. Loại cơ sở dữ liệu

**MongoDB (Atlas) – NoSQL**

###  Lý do lựa chọn:
- Không yêu cầu schema cố định → linh hoạt cho bài viết và bình luận
- Dễ mở rộng quan hệ người dùng – bài viết – bình luận
- Dễ tích hợp với NestJS qua thư viện Mongoose
- Hỗ trợ tốt cloud (MongoDB Atlas) và thao tác trên document dạng JSON

---

## 2. Tổng quan các collections

| Collection | Chức năng chính                        |
|------------|----------------------------------------|
| `users`    | Lưu thông tin người dùng               |
| `posts`    | Lưu bài viết                           |
| `comments` | Lưu bình luận và trả lời bình luận     |

---

## 3. Chi tiết các collections

---

###  Collection: `users`

| Trường             | Kiểu dữ liệu         | Mô tả                               |
|-------------------|----------------------|-------------------------------------|
| `_id`             | `ObjectId`           | Khóa chính                          |
| `email`           | `string`             | Email (duy nhất, bắt buộc)          |
| `password`        | `string`             | Mật khẩu đã mã hoá bằng bcrypt      |
| `username`        | `string`             | Tên người dùng (duy nhất)           |
| `bio`             | `string`             | Mô tả bản thân                      |
| `avatarUrl`       | `string`             | Đường dẫn ảnh đại diện Cloudinary   |
| `avatarPublicId`  | `string`             | Public ID dùng để xoá/sửa ảnh       |
| `joined`          | `Date`               | Ngày tham gia                       |
| `followers`       | `[ObjectId]`         | Danh sách người theo dõi            |
| `following`       | `[ObjectId]`         | Danh sách người được theo dõi       |
| `bookmarkedPosts` | `[ObjectId]`         | Danh sách bài viết đã bookmark      |
| `createdAt`       | `Date (auto)`        | Thời điểm tạo document              |
| `updatedAt`       | `Date (auto)`        | Thời điểm cập nhật cuối             |

---

###  Collection: `posts`

| Trường             | Kiểu dữ liệu         | Mô tả                                  |
|--------------------|----------------------|----------------------------------------|
| `_id`              | `ObjectId`           | Khóa chính                             |
| `title`            | `string`             | Tiêu đề bài viết                        |
| `content`          | `string` (HTML/MD)   | Nội dung bài viết                       |
| `coverImage`       | `string`             | URL ảnh bìa bài viết                    |
| `coverImagePublicId`| `string`            | ID ảnh để xoá khỏi Cloudinary          |
| `author`           | `ObjectId` → `users` | Người đăng bài                         |
| `likes`            | `[ObjectId]`         | Danh sách user đã like bài viết        |
| `bookmarks`        | `[ObjectId]`         | Danh sách user đã lưu bài viết         |
| `starredBy`        | `[ObjectId]`         | Danh sách user đã đánh sao bài viết    |
| `views`            | `number`             | Số lượt xem                            |
| `comments`         | `[ObjectId]` → `comments` | Danh sách comment ID (tối ưu hoá truy vấn) |
| `createdAt`        | `Date (auto)`        | Thời điểm tạo                          |
| `updatedAt`        | `Date (auto)`        | Thời điểm cập nhật cuối                |

---

###  Collection: `comments`

| Trường         | Kiểu dữ liệu         | Mô tả                                      |
|----------------|----------------------|--------------------------------------------|
| `_id`          | `ObjectId`           | Khóa chính                                 |
| `post`         | `ObjectId` → `posts` | Bài viết chứa bình luận                    |
| `author`       | `ObjectId` → `users` | Người viết bình luận                       |
| `content`      | `string`             | Nội dung bình luận                         |
| `parentComment`| `ObjectId` → `comments` _(optional)_ | Bình luận gốc nếu là reply |
| `createdAt`    | `Date (auto)`        | Thời điểm tạo                              |
| `updatedAt`    | `Date (auto)`        | Thời điểm cập nhật                         |

---

## 4. Mối quan hệ giữa các collections

### `users` ↔ `posts`

- 1 user có thể tạo nhiều bài viết
- Trường liên kết: `posts.author` → `users._id`

### `users` ↔ `comments`

- 1 user có thể viết nhiều bình luận
- Trường liên kết: `comments.author` → `users._id`

### `posts` ↔ `comments`

- 1 post có thể có nhiều comment
- Trường liên kết: `comments.post` → `posts._id`

### `comments` ↔ `comments`

- Bình luận có thể lồng nhau qua `parentComment`
- Quan hệ tự tham chiếu (self-reference)

---

## 5. Sơ đồ mối quan hệ (ER mô tả bằng văn bản)

```text
User ───────< Post
     └──────< Comment
Post ───────< Comment
Comment ────< Comment (reply)
