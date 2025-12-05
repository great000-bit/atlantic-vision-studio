import { Link } from 'react-router-dom';

export const AdminEntryIcon = () => {
  return (
    <Link
      to="/admin/login"
      className="block w-16 h-5 rounded border border-foreground/30 opacity-30 hover:opacity-50 transition-opacity"
      aria-label="Admin Panel Access"
    />
  );
};
