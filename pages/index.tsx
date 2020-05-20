import { useContext } from 'react';
import withApollo from 'data/with-apollo';
import Link from 'next/link';
import { Button } from 'antd';
import { useViewerQuery } from 'data/viewer.graphql';
import { ThemeContext } from './_app';
// import defaultVars from 'styles/defaultVars.json';
// import darkVars from 'styles/darkVars.json';
// import lightVars from 'styles/compactVars.json';
// import { darkThemeVars } from 'utils/getThemeVars';
// import { darkThemeSingle, getThemeVariables } from 'antd/dist/theme';
// import 'styles/global.scss';

const Index = () => {
  const { data } = useViewerQuery();
  const { setTheme } = useContext(ThemeContext);
  // const [theme, setTheme] = useState('light');

  // const changeTheme = () => {
  //   // const vars = getThemeVariables({ dark: true });
  //   // const newVars = Object.keys(vars).reduce((acc, key) => {
  //   //   if (key !== 'hack') acc[`@${key}`] = vars[key];
  //   //   return acc;
  //   // }, {});
  //   // setTheme('dark');
  //   // debugger;

  //   window.less
  //     .modifyVars(darkVars)
  //     .then(() => {
  //       console.log('Theme Changed!!!');
  //     })
  //     .catch((error: any) => {
  //       console.log('changeTheme -> error', error);

  //       // message.error(`Failed to update theme`);
  //     });
  // };

  if (data) {
    const { viewer } = data;
    return (
      <div>
        You're signed in as {viewer.name} and you're {viewer.status} goto{' '}
        <Link href="/about">
          <a>static</a>
        </Link>{' '}
        page.
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          onClick={() => setTheme('default')}
        >
          OK
        </Button>
      </div>
    );
  }

  return <div>...</div>;
};

export default withApollo(Index);
