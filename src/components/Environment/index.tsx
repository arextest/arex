import { Button } from 'antd';

const Environment = ({ activePane }) => {
  return (
    <div>
      <Button
        onClick={() => {
          activePane();
        }}
      >
        新增
      </Button>
    </div>
  );
};

export default Environment;
