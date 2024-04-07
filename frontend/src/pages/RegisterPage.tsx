import { RegisterForm } from "../components/forms/register"
import { Page } from "../utils/styles"

const RegisterPage = () => {
  return (
    <Page display="flex" justifyContent="center" alignItems="center">
      <RegisterForm/>
    </Page>
  )
}

export default RegisterPage