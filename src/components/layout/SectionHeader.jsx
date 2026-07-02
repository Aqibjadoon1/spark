/**
 * Minimal section header with title and optional action.
 * @param {string} props.title - Section heading text
 * @param {React.ReactNode} props.action - Optional action element (button, link, etc.)
 * @param {string} props.className - Additional CSS classes
 */
const SectionHeader = ({ title, action, className = '' }) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h2 className="text-lg font-semibold text-[#191A23] dark:text-white">{title}</h2>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHeader;
