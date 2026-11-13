# TimeMate (타임메이트)

> 당신의 시간은 소중하고 가치 있다. — 1시간 = 1 Time Coin

시간을 기반으로 재능을 교환하는 플랫폼입니다.

## 구조

```
timemate/
├─ frontend/   Next.js 16.4 (App Router, TypeScript, Tailwind CSS 4, Zustand)
├─ backend/    NestJS 12.4 · CLI 12.0.12 (ESM, Vitest)
└─ package.json   루트 실행 스크립트
```

### 버전 기준 (학원 수업 버전과 통일)

| 패키지 | 버전 |
|---|---|
| Next.js | 16.4.x |
| NestJS | 12.4.x (`~12.4.2`) |
| Nest CLI | 12.0.12 |
| Prisma | 6.4.1 (도입 예정) |

### frontend/src

| 경로 | 내용 |
|---|---|
| `app/globals.css` | **디자인 토큰** (Tailwind `@theme`: 컬러·타이포·radius·shadow·애니메이션) + `page-container`, `focus-ring` 유틸 |
| `components/brand` | 로고: 두 화살표가 맞물려 순환하는 심볼(SVG). 원본 이미지·SVG는 `docs/brand/` |
| `components/common` | Button, Input / PasswordInput / SearchInput / Textarea, Select, Modal / ConfirmModal, Toaster, Dropdown, Tooltip, Skeleton, Pagination, Badge, Avatar, Tabs, Chip, Rating, EmptyState / ErrorState, Card, SectionHeader, Spinner, RelativeTime |
| `components/domain` | TalentCard(+Skeleton), ProfileCard(+Skeleton), CoinCard, ReviewCard, PostCard, ChatMessage, NotificationItem, Calendar, TradeStatusBadge |
| `components/layout` | AppShell, Header(다크 네이비), MobileMenu(햄버거), Navigation(하단 탭), Sidebar, Footer, PageHeader, ComingSoon |
| `app/(main)` | 메인 `/` · 서비스 소개 `/onboarding` — 비회원 접근 가능, 히어로가 헤더에 붙는 레이아웃 (`AppShell requireAuth={false} flush`) |
| `components/about` | 서비스 소개 섹션 (AboutHero, Intro, Values, How, TimeCoin, Persona) |
| `app/(public)` | 비회원도 볼 수 있는 탐색 페이지: `/talents`, `/talents/[id]` |
| `components/talents` | 재능 찾기(TalentSearchPage, FilterPanel, useTalentQuery) · 재능 상세(TalentDetailPage, ApplyCard, ScheduleTable) |
| `lib/talentQuery.ts` | 검색 조건 ↔ URL 쿼리 변환 (q, category, mode, region, hours, affordable, minRating, provider, sort, page) |
| `components/home` | 메인 페이지 섹션 (Hero, CoinSection, CategorySection, TalentSection, HowItWorks, RecentActivity, BottomCta) |
| `app/(service)` | 로그인 후 서비스 영역 (Header + 하단 탭, 로그인 가드) |
| `app/(auth)` | 비회원 영역 (온보딩·로그인·회원가입·비밀번호 찾기·약관) |

### 디자인 토큰 사용법 (Tailwind 클래스)

| 용도 | 클래스 |
|---|---|
| 브랜드 | `bg-navy` `bg-point` `bg-sub` `bg-secondary` (+ `-hover` `-soft` `-strong`) |
| 배경 | `bg-bg`(페이지) `bg-surface`(카드) |
| 글자 | `text-fg` `text-fg-secondary` `text-fg-muted` `text-fg-disabled` |
| 선 | `border-border` `border-divider` |
| 상태 | `text-success` `bg-error-soft` `text-warning` `text-info` … |
| 타이포 | `text-display` `text-h1`~`text-h4` `text-body-lg/md/sm` `text-caption` `text-button` `text-label` |
| 레이아웃 | `page-container`(최대 1280px) · 간격 4px 단위(`p-4`=16px) · breakpoint `md`(768) `lg`(1024) |
| `store` | Zustand: auth, wallet(코인 원장), notification, toast |
| `lib/coin/ledger.ts` | Time Coin 원장 순수 함수 (LOCK / 해제 / 정산, 중복 정산 방지) |
| `lib/api` | API 클라이언트 (mock ↔ NestJS 전환 지점) |
| `mocks/data.ts` | **테스트용 데이터** |
| `types` | 도메인 타입 (User, Talent, Trade, Wallet, CoinTx, Post …) |

## 실행

```bash
npm run install:all     # 최초 1회
npm run dev:frontend    # http://localhost:3000
npm run dev:backend     # http://localhost:10000/api/health
```

- 디자인 시스템 확인: http://localhost:3000/design-system

## 실제 API / 임시 데이터 구분

| 영역 | 현재 | 실제 연동 계획 |
|---|---|---|
| 서버 상태 확인 | **[API]** `GET /api/health` | 완료 |
| 로그인 상태 | [MOCK] 데모 사용자 자동 로그인, `/login` 데모 버튼 | STEP 5: Passport + JWT `/api/auth/*` |
| 코인 잔액/내역 | [MOCK] 클라이언트 원장 (`ledger.ts`) + localStorage | STEP 8: NestJS WalletService + Prisma 트랜잭션 |
| 재능 검색·상세·후기 | [MOCK] `lib/api/talents.ts` + `mocks/talentDetails.ts` | `GET /api/talents`(검색·필터·정렬·페이지), `/api/talents/:id`, `/api/talents/:id/reviews`, `/api/talents/regions` |
| 추천·인기 재능, 인기 키워드 | [MOCK] `lib/api/talents.ts` | `GET /api/talents/recommended`, `/api/search/keywords/popular` |
| 최근 활동 (거래·예약·채팅) | [MOCK] `lib/api/activity.ts` | STEP 6~8: `GET /api/me/activity` |
| 관심(하트) 재능 | [MOCK] `store/likeStore.ts` (localStorage) | `POST/DELETE /api/talents/:id/like`, `GET /api/me/likes` |
| 커뮤니티·알림 | [MOCK] `mocks/data.ts` | STEP 9, 11 |

코드에서 `[MOCK]` / `[API]` 주석으로 구분합니다. `NEXT_PUBLIC_USE_MOCK=false` 로 전환합니다.

## Time Coin 정책 (구현됨)

- 거래 확정 시 이용자 코인 LOCK → 사용 가능 = 보유 − 잠금
- 거래 완료 시 잠긴 코인을 제공자에게 정산 (tradeId당 1회, 중복 정산 차단)
- 거래 취소 시 LOCK 해제
- 코인 단위는 1시간 = 1 TC, 정수만 허용

## Next.js 16 주의사항

- `cacheComponents` 활성화 상태 → 렌더 중 `Date.now()`/`new Date()` 금지 (`useNow`, `RelativeTime` 사용)
- 동적 라우트에서 `usePathname` 은 `PathnameBoundary`(Suspense) 안에서만 사용
- `params` 는 Promise (`await params`)
