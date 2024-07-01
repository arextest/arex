import { Tour, TourProps } from 'antd';
import React, { useState } from 'react';

const steps: TourProps['steps'] = [
  {
    title: 'Collection—Here',
    description:
      'You are enabled to review and perform your stored test cases, as well as to create additional ones manually.',
    target: () => document.querySelector('.ant-menu-item:nth-child(1)') as HTMLElement,
  },
  {
    title: 'Report—Here',
    description: 'You can check the test reports, and run a test.',
    target: () => document.querySelector('.ant-menu-item:nth-child(2)') as HTMLElement,
  },
];

const QuickTour: React.FC = () => {
  const [open, setOpen] = useState<boolean>(localStorage.getItem('quickToured') ? false : true);
  localStorage.setItem('quickToured', 'true');
  return (
    <div>
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
};

export default QuickTour;
