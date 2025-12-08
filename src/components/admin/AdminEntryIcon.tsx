import { Link } from 'react-router-dom';

export const AdminEntryIcon = () => {
  return (
    <Link to="/admin/login">
      <button 
        className="w-16 h-5 rounded border border-foreground/20 bg-transparent opacity-20 hover:opacity-50 transition-opacity duration-300 cursor-pointer"
        aria-label="Admin Panel Access"
        style={{ 
          background: 'transparent',
        }}
      />
    </Link>
  );
};
