
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items?: { label: string; path: string }[];
  showHome?: boolean;
}

const Breadcrumbs = ({ items = [], showHome = true }: BreadcrumbsProps) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
  
  // Generate breadcrumbs automatically if no items are provided
  const breadcrumbs = items.length > 0 ? items : pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path
    };
  });

  return (
    <nav className="flex py-2 text-sm" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {showHome && (
          <li className="inline-flex items-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
          </li>
        )}
        
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="inline-flex items-center">
            <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-800 dark:text-gray-200 font-medium">
                {breadcrumb.label}
              </span>
            ) : (
              <Link 
                to={breadcrumb.path} 
                className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
