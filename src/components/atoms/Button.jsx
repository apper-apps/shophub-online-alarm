import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  icon,
  iconPosition = "left",
  loading = false,
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-xl hover:scale-105 active:scale-95",
    secondary: "bg-white text-secondary-700 border border-secondary-200 hover:bg-secondary-50 hover:shadow-md",
    ghost: "text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl hover:scale-105 active:scale-95",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl hover:scale-105 active:scale-95"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
    icon: "p-3"
  };

  return (
    <button
      className={cn(
        "font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={loading}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" size={18} className="animate-spin" />}
      {!loading && icon && iconPosition === "left" && <ApperIcon name={icon} size={18} />}
      {children}
      {!loading && icon && iconPosition === "right" && <ApperIcon name={icon} size={18} />}
    </button>
  );
});

Button.displayName = "Button";

export default Button;