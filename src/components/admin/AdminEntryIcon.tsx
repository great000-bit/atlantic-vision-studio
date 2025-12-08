import { Link } from 'react-router-dom';

export const AdminEntryIcon = () => {
  return (
    <Link to="/admin/login">
      <button 
        className="w-5 h-5 rounded border border-foreground/10 bg-foreground/10 opacity-10 hover:opacity-40 transition-all duration-300 cursor-pointer hover:scale-110 backdrop-blur-sm"
        aria-label="Admin login"
      >
      </button>
    </Link>
  );
};