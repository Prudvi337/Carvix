
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  className?: string;
  text?: string;
}

const Loader = ({ size = "medium", className, text }: LoaderProps) => {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={cn(
          "border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin", 
          sizeClasses[size],
          className
        )}
      />
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export default Loader;
