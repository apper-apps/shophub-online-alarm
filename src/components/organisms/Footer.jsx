import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = ({ className = "" }) => {
  const footerSections = [
    {
      title: "Shop",
      links: [
        { name: "Electronics", path: "/category/electronics" },
        { name: "Fashion", path: "/category/fashion" },
        { name: "Home & Garden", path: "/category/home-garden" },
        { name: "Books", path: "/category/books" },
        { name: "Sports", path: "/category/sports" }
      ]
    },
    {
      title: "Customer Service",
      links: [
        { name: "Contact Us", path: "/contact" },
        { name: "Shipping Info", path: "/shipping" },
        { name: "Returns", path: "/returns" },
        { name: "Size Guide", path: "/size-guide" },
        { name: "FAQ", path: "/faq" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Press", path: "/press" },
        { name: "Investor Relations", path: "/investors" },
        { name: "Sustainability", path: "/sustainability" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "Data Protection", path: "/data-protection" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "Facebook", url: "#" },
    { name: "Twitter", icon: "Twitter", url: "#" },
    { name: "Instagram", icon: "Instagram", url: "#" },
    { name: "YouTube", icon: "Youtube", url: "#" }
  ];

  return (
    <footer className={`bg-secondary-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-secondary-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-secondary-700 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-secondary-300 mb-4">
              Subscribe to our newsletter for exclusive deals and new arrivals.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-secondary-800 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-white placeholder-secondary-400"
              />
              <button className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-secondary-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
              <ApperIcon name="ShoppingBag" size={24} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-xl">ShopHub</div>
              <div className="text-secondary-400 text-sm">
                © 2024 ShopHub. All rights reserved.
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-secondary-400 text-sm">Follow us:</span>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="bg-secondary-800 p-2 rounded-lg hover:bg-secondary-700 transition-colors duration-200"
                  aria-label={social.name}
                >
                  <ApperIcon name={social.icon} size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;