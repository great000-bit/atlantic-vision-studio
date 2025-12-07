import { Link } from 'react-router-dom';

export const AdminEntryIcon = () => {
  return (
  <>
  <Link to="/admin/login">
      <button className="block w-40 h-5 rounded border border-foreground/30 opacity-10 hover:opacity-50 transition-opacity bg-white cursor-pointer">
      admin button
      </button>
</Link>
      </>
  );
};
