import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const queryProvider = new QueryClient();

const Provider = ({ children }: PropsWithChildren): React.JSX.Element => {
  return (
    <QueryClientProvider client={queryProvider}>{children}</QueryClientProvider>
  );
};

export default Provider;
