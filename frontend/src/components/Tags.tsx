interface TagsProps {
  tags?: string[];
}

export const CustomTags: React.FC<TagsProps> = ({ tags = [] }) => {
  return (
    <div className="flex flex-wrap">
      {tags?.map((tag: string, index: number) => (
        <div
          key={index}
          className="mr-2 mb-2 border-2 border-1 px-2 py-1 rounded-lg min-w-12 text-center border-black/60 text-black/60 dark:border-white/70 dark:text-white/60"
        >
          {tag}
        </div>
      ))}
    </div>
  );
};
