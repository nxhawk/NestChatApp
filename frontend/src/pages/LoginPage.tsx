import { LoginForm } from '../components/forms/login';
import { Page } from '../utils/styles';

const LoginPage = () => {
  return (
    <Page display="flex" justifyContent="center" alignItems="center">
      <LoginForm />
    </Page>
  );
};

export default LoginPage;