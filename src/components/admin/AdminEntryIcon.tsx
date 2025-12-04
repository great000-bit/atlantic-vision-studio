import { Link } from 'react-router-dom';

export const AdminEntryIcon = () => {
  return (
    <Link
      to="/admin"
      className="inline-block px-4 py-1.5 mt-4 rounded-md text-xs font-medium tracking-wide transition-all duration-300
        bg-foreground/5 backdrop-blur-sm border border-foreground/10
        text-foreground/30 hover:text-foreground/80
        hover:bg-foreground/10 hover:border-foreground/20 hover:backdrop-blur-md"
      aria-label="Admin Access"
    >
      Admin Access
    </Link>
  );
};
