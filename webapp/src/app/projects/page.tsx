"use client";
import Content from "@/components/Content";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return await axios("http://localhost:1337/api/projects");
    },
  });

  return (
    <Content>
      Projects <code>{JSON.stringify(data?.data, null, 2)}</code>
    </Content>
  );
}
