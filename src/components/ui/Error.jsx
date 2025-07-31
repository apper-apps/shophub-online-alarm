import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-96 text-center px-4 ${className}`}>
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl shadow-lg max-w-md mx-auto">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={32} className="text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-secondary-900 mb-3">
          Oops! Something went wrong
        </h3>
        
        <p className="text-secondary-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={18} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;