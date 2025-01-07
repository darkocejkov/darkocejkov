"use client";
import Content from "@/components/Content";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["diplomas"],
    queryFn: async () => {
      return await axios("http://localhost:1337/api/diplomas");
    },
  });

  return (
    <Content>
      Education <code>{JSON.stringify(data?.data, null, 2)}</code>
    </Content>
  );
}
