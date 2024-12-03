import { ThreeDots } from 'react-loader-spinner';
import { BotAvatar } from './bot-avatar';

const ThreeDotsLoader = () => {
  return (
    <div className="flex items-start gap-x-3">
      <div className="p-4 rounded-2xl max-w-[85%] bg-gray-100 text-gray-900 rounded-tl-none">
        <ThreeDots
          height="20"
          width="40"
          radius="9"
          color="#4B5563"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    </div>
  );
};

export default ThreeDotsLoader; 