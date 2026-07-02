/**
 * Page header with title and action buttons. Used for section headers.
 * @param {string} props.title - Header title text
 * @param {React.ReactNode} props.actions - React nodes for action buttons
 */
const Header = ({ title, actions }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
};

export default Header;
