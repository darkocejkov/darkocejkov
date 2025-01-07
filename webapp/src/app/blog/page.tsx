"use client";
import Content from "@/components/Content";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      return await axios("http://localhost:1337/api/posts");
    },
  });

  return (
    <Content>
      Blog<code>{JSON.stringify(data?.data, null, 2)}</code>
    </Content>
  );
}
