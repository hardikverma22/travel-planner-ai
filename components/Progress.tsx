"use client";
import {AppProgressBar as ProgressBar} from "next-nprogress-bar";

const Progress = () => {
  return (
    <ProgressBar height="4px" options={{showSpinner: true}} shallowRouting />
  );
};

export default Progress;
