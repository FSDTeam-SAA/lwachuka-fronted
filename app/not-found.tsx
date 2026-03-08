export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#061F3D] px-4">
      <div className="text-center max-w-lg">
        
        {/* 404 Title */}
        <h1 className="text-7xl md:text-8xl font-bold text-white">
          404
        </h1>

        {/* Subtitle */}
        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-300">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-400 text-sm md:text-base">
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <a
          href="/"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#1E1E1E] text-white font-medium hover:opacity-90 transition"
        >
          Go Back Home
        </a>

      </div>
    </div>
  );
}