const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl border border-secondary-200 overflow-hidden">
            {/* Image Skeleton */}
            <div className="w-full h-64 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 animate-pulse"></div>
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <div className="h-4 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded w-3/4 animate-pulse"></div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded animate-pulse"></div>
                <div className="h-4 w-12 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded animate-pulse"></div>
              </div>
              
              {/* Price */}
              <div className="h-6 w-24 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded animate-pulse"></div>
              
              {/* Button */}
              <div className="h-10 bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;