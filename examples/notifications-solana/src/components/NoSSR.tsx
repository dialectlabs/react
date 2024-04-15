import dynamic from 'next/dynamic';

const NoSSRInner = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export default dynamic(() => Promise.resolve(NoSSRInner), { ssr: false });
