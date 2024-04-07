import { useForm } from 'react-hook-form';
import styles from '../index.module.scss';
import UsernameField from './UsernameField';
import { CreateUserParams } from '../../../utils/types';
import { NameField } from './NameField';
import { PasswordField } from './PasswordField';
import { Button } from '../../../utils/styles';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postRegisterUser } from '../../../utils/api';

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserParams>({ reValidateMode: 'onBlur' });
  
  const navigate = useNavigate();
  const onSubmit = async (data: CreateUserParams) => {
    try {
      await postRegisterUser(data);
      navigate('/login');
      toast.clearWaitingQueue();
      toast.success('Account created!');
    } catch (error) {
      toast.clearWaitingQueue();
      toast.error('Error creating user');
    }
  }

  const formFieldProps = { errors, register };
  return(
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <UsernameField {...formFieldProps}/>
      <NameField {...formFieldProps} />
      <PasswordField {...formFieldProps}/>
      <Button className={styles.button}>Create My Account</Button>
      <div className={styles.footerText}>
        <span>Already have an account? </span>
        <Link to="/login">
          <span>Login</span>
        </Link>
      </div>
    </form>
  );
}