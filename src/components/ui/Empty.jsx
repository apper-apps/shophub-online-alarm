import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing to see here", 
  message = "It looks like there's nothing here yet.",
  actionText = "Browse Products",
  onAction,
  icon = "Package",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-96 text-center px-4 ${className}`}>
      <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-8 rounded-2xl shadow-lg max-w-md mx-auto">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <ApperIcon name={icon} size={32} className="text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-secondary-900 mb-3">
          {title}
        </h3>
        
        <p className="text-secondary-600 mb-6 leading-relaxed">
          {message}
        </p>
        
        {onAction && (
          <button
            onClick={onAction}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ApperIcon name="ArrowRight" size={18} />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;