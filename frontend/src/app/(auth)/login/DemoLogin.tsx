"use client";

import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button, Card, Badge } from "@/components/common";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";
import { ME_ID, mockUsers } from "@/mocks/data";

/**
 * [MOCK] STEP 5 로그인 화면 구현 전까지 사용하는 임시 데모 로그인.
 * 로그아웃 → 재로그인 흐름이 끊기지 않도록 제공한다.
 */
export function DemoLogin() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleLogin = () => {
    const demo = mockUsers.find((u) => u.id === ME_ID);
    if (!demo) return;
    login(demo);
    toast.success(`${demo.nickname}님, 환영해요!`);
    const next = new URLSearchParams(window.location.search).get("next");
    router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/");
  };

  return (
    <div className="page-container max-w-[440px]">
      <Card>
        <Badge tone="warning">임시 화면 · STEP 5에서 교체</Badge>
        <h1 className="mt-4 mb-2 text-h2">로그인</h1>
        <p className="mb-6 text-fg-muted">
          이메일 로그인은 STEP 5(회원가입·로그인·인증)에서 구현됩니다. 지금은 데모 계정으로 서비스를 둘러볼 수 있어요.
        </p>
        <Button variant="primary" size="lg" fullWidth leftIcon={<LogIn size={18} />} onClick={handleLogin}>
          데모 계정으로 시작하기
        </Button>
      </Card>
    </div>
  );
}
