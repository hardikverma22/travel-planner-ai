"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const Progress = () => {
  return (
    <ProgressBar
      height="4px"
      color="#0066FF"
      options={{
        showSpinner: true,
        trickle: true,
        trickleSpeed: 200,
        minimum: 0.08,
      }}
      shallowRouting
    />
  );
};

export default Progress;
