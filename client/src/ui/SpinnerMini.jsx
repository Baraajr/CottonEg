import { BiLoaderAlt } from 'react-icons/bi';

function SpinnerMini() {
  return (
    <BiLoaderAlt
      className="h-5 w-5 animate-spin text-current"
      style={{ animationDuration: '1.5s' }}
      aria-label="Loading"
      role="status"
    />
  );
}

export default SpinnerMini;
