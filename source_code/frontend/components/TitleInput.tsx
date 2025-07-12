export default function TitleInput({ title, setTitle }: { title: string; setTitle: (val: string) => void }) {
    return (
        <input
            type="text"
            placeholder="Tiêu đề bài viết..."
            className="w-full text-4xl font-bold placeholder-gray-400 border-b-2 border-gray-200 focus:border-blue-500 bg-transparent py-2 focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
    );
}