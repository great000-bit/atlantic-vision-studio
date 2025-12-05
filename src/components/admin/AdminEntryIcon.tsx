import { Link } from 'react-router-dom';

export const AdminEntryIcon = () => {
  return (
    <Link
      to="/admin/login"
      className="block w-16 h-5 rounded border border-foreground/10 opacity-20"
      aria-label="Admin Panel Access"
      style={{ background: 'transparent' }}
    />
  );
};
