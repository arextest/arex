// import ConsoleFeed from './components/ConsoleFeed';
import ConfigMiddlewareProvider from './providers/ConfigMiddlewareProvider';
import MainProvider from './store/content/MainContent';
import ThemeMiddlewareProvider from './theme/ThemeMiddlewareProvider';
const App = () => {
  // 明亮、黑暗主题
  return (
    <MainProvider>
      <ConfigMiddlewareProvider>
        <ThemeMiddlewareProvider />
      </ConfigMiddlewareProvider>
    </MainProvider>
  );
};

export default App;
