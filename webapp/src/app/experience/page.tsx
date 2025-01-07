"use client";

import Content from "@/components/Content";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Page() {
  const { data: jobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      return await axios("http://localhost:1337/api/jobs");
    },
  });

  const { data: skills } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      return await axios("http://localhost:1337/api/skills");
    },
  });

  console.log({ jobs, skills });

  return (
    <Content>
      Experience
      <code>{JSON.stringify(jobs?.data, null, 2)}</code>
      <code>{JSON.stringify(skills?.data, null, 2)}</code>
    </Content>
  );
}
