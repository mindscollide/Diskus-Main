import { useErrorBoundary } from "react-error-boundary";

export const ErrorFallback = ({ error }) => {
  const { resetBoundary } = useErrorBoundary();
  console.log(error, "errorerror");
  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button onClick={resetBoundary}>Try again</button>
    </div>
  );
};


export const logErrors = (error, info) => {
  console.log("logErrors error :", error);
  console.log("logErrors error :", JSON.stringify(info));
};
