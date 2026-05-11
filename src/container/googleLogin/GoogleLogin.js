import { GoogleLogin } from "react-google-login";

const clientId =
  "509020224191-pst82a2kqjq33phenb35b0bg1i0q762o.apps.googleusercontent.com";

function GoogleLoginFunction() {
  const responseGoogle = (response) => {
    
  };
  const responseError = (error) => {
    
  };
  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Signin Google"
        onSuccess={responseGoogle}
        onFailure={responseError}
        cookiePolicy={"single_host_origin"}
        scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.events" //openid email profile
        access_type="offline"
        responseType="code"
        prompt="consent"
      />
    </div>
  );
}
export default GoogleLoginFunction;
