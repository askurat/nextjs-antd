import { useContext } from 'react';
import { Button } from 'antd';
import { ThemeContext } from './_app';

const Index = () => {
  const { setTheme } = useContext(ThemeContext);

  return (
    <div>
      Testing Ant Design with Less...
      <Button
        size="large"
        type="primary"
        htmlType="submit"
        onClick={() => setTheme('default')}
      >
        Change Theme
      </Button>
    </div>
  );
};

export default Index;
