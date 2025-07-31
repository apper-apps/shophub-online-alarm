import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const CategoryCard = ({ category, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Link
        to={`/category/${category.slug}`}
        className="block bg-gradient-to-br from-white to-secondary-50 rounded-xl border border-secondary-200 p-6 text-center transition-all duration-200 hover:shadow-xl hover:-translate-y-1 group"
      >
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <ApperIcon name={category.icon} size={24} className="text-white" />
        </div>
        
        <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
          {category.name}
        </h3>
        
        <p className="text-sm text-secondary-600">
          {category.productCount} products
        </p>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;