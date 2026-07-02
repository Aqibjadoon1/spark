const StatusBadge = ({ status = 'todo', color }) => {
  const config = {
    todo: { label: 'Todo', classes: 'bg-gray-500/20 text-gray-500 dark:text-white/70' },
    'in-progress': { label: 'In Progress', classes: 'bg-blue-500/20 text-blue-300' },
    done: { label: 'Done', classes: 'bg-green-500/20 text-green-300' },
  };

  const { label, classes } = config[status] || config.todo;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color || classes}`}
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
