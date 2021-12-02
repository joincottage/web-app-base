import dynamic from 'next/dynamic';
import 'sendbird-uikit/dist/index.css';

const DynamicAppWithNoSSR = dynamic(() => import('../components/Chat'), {
  ssr: false,
  loading: () => <p>...</p>,
});

const Chat = () => (
  <div>
    <DynamicAppWithNoSSR />
  </div>
);

export default Chat;
