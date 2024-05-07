import {FieldError} from "react-hook-form";

const ErrorMessage = ({error, isTouched}: {error: FieldError | undefined; isTouched: boolean}) => {
  return (
    error?.message &&
    isTouched && <p className="text-sm font-thin text-red-400">{error?.message}</p>
  );
};

export default ErrorMessage;
