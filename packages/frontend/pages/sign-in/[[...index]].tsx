import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div className="min-w-full mx-auto">
    <SignIn path="/sign-in" routing="path" />
  </div>
);

export default SignInPage;
