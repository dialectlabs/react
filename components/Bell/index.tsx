import React from 'react';
import { BellIcon } from '@heroicons/react/outline';


export function Bell(): JSX.Element {
  return <BellIcon className='h-5 w-5' />;
}

// export const aThing = (): unknown => {
//   return {thisThing: 'thatThing'};
// };

/*
1. import -> export in index.ts
2. export default in Bell/index.ts
3. or the .next cache

yarn dev uses the cache, because it's development. 100% sure -> yarn build -> yarn start (check nextjs docs for whatever runs production)
*/
