const Loader = ({ fullScreen = false, text }) => {
  const Spinner = () => (
    <div className="flex flex-col items-center py-12" role="status" aria-label="Loading">
      <div className="w-8 h-8 border-2 border-lime border-t-transparent rounded-full animate-spin" />
      {text && <span className="text-sm text-text-muted mt-3">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <Spinner />
      </div>
    );
  }

  return <Spinner />;
};

export default Loader;
