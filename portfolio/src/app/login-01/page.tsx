"use client";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/shadcn-space/blocks/login-01/login";

const Page = () => {
  const router = useRouter();
  return <LoginForm onSuccess={() => router.push("/")} />;
};

export default Page;