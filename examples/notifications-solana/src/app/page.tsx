'use client';
import { Notifications } from '@dialectlabs/react-ui';
import '@dialectlabs/react-ui/index.css';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="dialect">
        {/*<Button loading>test 123</Button>*/}
        <Notifications />
      </div>
    </main>
  );
}
