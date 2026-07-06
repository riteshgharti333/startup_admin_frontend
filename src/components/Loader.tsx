interface LoaderProps {
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({
  fullScreen = false,
  text = "Loading...",
}: LoaderProps) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      {/* Spinner */}
      <div className="relative">
        <div className="w-14 h-14 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Loading text with dots animation */}
      <div className="flex items-center gap-1">
        <p className="text-blue-600 font-medium text-lg">{text}</p>
        <span className="flex gap-1 mt-1">
          <span
            className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></span>
          <span
            className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></span>
        </span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      {loaderContent}
    </div>
  );
}
