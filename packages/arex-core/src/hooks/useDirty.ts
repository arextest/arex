import { useState } from 'react';

const useDirty = () => {
  const [isDirty, setIsDirty] = useState(false);
  return { isDirty, dirty: () => setIsDirty(true), reset: () => setIsDirty(false) };
};

export default useDirty;
