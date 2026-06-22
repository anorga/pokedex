import { useIsFetching } from "@tanstack/react-query";

/** A thin indeterminate bar shown whenever queries are fetching. */
function ProgressBar() {
  const fetching = useIsFetching();
  if (!fetching) return null;

  return (
    <div
      className="fixed inset-x-0 top-0 z-[90] h-0.5 overflow-hidden bg-transparent"
      role="progressbar"
      aria-label="Loading"
    >
      <div className="progress-segment rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-red-500" />
    </div>
  );
}

export default ProgressBar;
