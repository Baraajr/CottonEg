import { BiLoaderAlt } from 'react-icons/bi';

function SpinnerMini() {
  return (
    <BiLoaderAlt
      className="w-10 h-10 animate-spin"
      style={{ animationDuration: '1.5s' }}
    />
  );
}

export default SpinnerMini;
