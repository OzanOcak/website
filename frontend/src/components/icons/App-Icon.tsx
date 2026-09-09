import Image from "next/image";

interface AppIconProps {
  icon: string; // Image path
  title: string; // Alt text
  className?: string;
  size?: "sm" | "md" | "lg" | number;
}

const sizeMap = {
  sm: 20,
  md: 24,
  lg: 32,
};

export const AppIcon = ({
  icon,
  title,
  className = "w-6 h-6",
  size = "md",
}: AppIconProps) => {
  const pixelSize = typeof size === "number" ? size : sizeMap[size];

  return (
    <div className={`relative ${className}`}>
      <Image
        src={icon}
        alt={title}
        width={pixelSize}
        height={pixelSize}
        className="object-contain"
      />
    </div>
  );
};
