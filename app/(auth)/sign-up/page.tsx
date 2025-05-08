import { cookies } from "next/headers";
import SignUp from "@/components/auth-components/sign-up";
import Otp from "@/components/auth-components/otp";

const SignUpPage = async () => {
  const cookieStore = await cookies();
  const signupToken = cookieStore.get("signup_process_token");

  return (
    <>{signupToken ? <Otp signup_token={signupToken.value} /> : <SignUp />}</>
  );
};

export default SignUpPage;
