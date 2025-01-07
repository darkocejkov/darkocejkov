import React from "react";

const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={"w-full h-full gap-2 flex flex-col overflow-y-auto"}>
      {children}
    </div>
  );
};

export default Content;
