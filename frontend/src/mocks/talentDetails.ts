/**
 * [TEST DATA] 재능 상세 화면용 임시 데이터.
 * 실제 연동 시 GET /api/talents/:id, /api/talents/:id/reviews, /api/talents/:id/availability 응답으로 대체.
 * 화면에서 직접 import 하지 말고 lib/api/talents.ts 를 통해 사용한다.
 */
import type { Review, TalentDetailInfo, WeeklySlot } from "@/types";

const weekdays = (start: string, end: string): WeeklySlot[] =>
  ([1, 2, 3, 4, 5] as const).map((day) => ({ day, start, end }));

export const mockTalentDetails: Record<string, TalentDetailInfo> = {
  t_video_01: {
    images: [],
    offerings: ["컷 편집 단축키와 작업 흐름", "자막 템플릿 만들기", "기본 색보정(LUT 적용)", "유튜브 업로드용 내보내기 설정"],
    targets: ["브이로그를 처음 편집해 보는 분", "편집 시간이 너무 오래 걸리는 분"],
    materials: ["프리미어 프로가 설치된 노트북", "편집할 영상 소스 10분 내외"],
    process: ["화면 공유로 함께 편집합니다", "1시간차: 컷 편집 / 2시간차: 자막·색보정"],
    notes: ["프리미어 프로 체험판도 괜찮아요", "녹화는 미리 협의해 주세요"],
    schedule: [...weekdays("19:00", "22:00"), { day: 6, start: "13:00", end: "18:00" }],
  },
  t_design_01: {
    images: [],
    offerings: ["오토레이아웃 기본 원리", "Variants로 버튼·카드 컴포넌트 만들기", "디자인 토큰(컬러·타이포) 관리"],
    targets: ["피그마 기초는 아는 주니어 디자이너", "디자인 시스템을 처음 만들어 보는 분"],
    materials: ["피그마 계정(무료 플랜 가능)"],
    process: ["온라인: 화면 공유 / 오프라인: 성남 판교역 인근 카페", "실습 파일을 공유해 드려요"],
    notes: ["오프라인은 음료값 각자 부담이에요"],
    schedule: [
      { day: 6, start: "10:00", end: "12:00" },
      { day: 0, start: "10:00", end: "12:00" },
    ],
  },
  t_lang_01: {
    images: [],
    offerings: ["관심 주제 프리토킹", "자연스러운 표현으로 교정", "대화 후 표현 정리 노트 제공"],
    targets: ["영어 말하기 자신감을 키우고 싶은 분", "해외 여행·출장을 앞둔 분"],
    materials: ["마이크가 있는 이어폰", "이야기하고 싶은 주제 1~2개"],
    process: ["화상 통화로 진행해요", "처음 10분은 레벨 체크 대화"],
    notes: ["시작 10분 전까지 일정 변경 가능해요"],
    schedule: [...weekdays("07:00", "09:00"), ...weekdays("20:00", "22:00")],
  },
  t_music_01: {
    images: [],
    offerings: ["기타 잡는 자세와 튜닝", "기본 코드 C·G·Am·F", "스트로크 패턴 2가지", "한 곡 완주"],
    targets: ["기타를 처음 잡아보는 분", "혼자 독학하다 막힌 분"],
    materials: ["통기타 (없으면 연습용 기타 대여 가능)"],
    process: ["서울대입구역 인근 연습실에서 1:1로 진행해요"],
    notes: ["손톱을 짧게 정리해 오시면 좋아요"],
    schedule: [
      { day: 6, start: "14:00", end: "18:00" },
      { day: 0, start: "14:00", end: "18:00" },
    ],
  },
  t_dev_01: {
    images: [],
    offerings: ["useState·useEffect 핵심 정리", "컴포넌트 분리 기준", "상태 끌어올리기 실습"],
    targets: ["React 입문 강의를 막 끝낸 분", "컴포넌트 설계가 어려운 분"],
    materials: ["Node.js 설치된 노트북", "VS Code"],
    process: ["화면 공유 + 라이브 코딩", "실습 저장소를 미리 공유해 드려요"],
    notes: ["간단한 JavaScript 문법은 알고 오시면 좋아요"],
    schedule: weekdays("20:00", "22:00"),
  },
  t_dev_02: {
    images: [],
    offerings: ["파이썬 설치와 기본 문법", "엑셀 파일 읽고 정리하기(openpyxl)", "폴더 안 파일 이름 일괄 변경", "내 업무에 맞는 스크립트 만들기"],
    targets: ["반복 업무를 줄이고 싶은 직장인", "코딩이 처음인 분"],
    materials: ["노트북", "자동화하고 싶은 업무 예시(엑셀 파일 등)"],
    process: ["화면 공유로 함께 코드를 작성해요", "완성한 스크립트는 그대로 가져가세요"],
    notes: ["회사 기밀 자료는 샘플로 바꿔서 가져와 주세요"],
    schedule: [...weekdays("20:00", "22:00"), { day: 6, start: "10:00", end: "12:00" }],
  },
  t_sports_01: {
    images: [],
    offerings: ["호흡법과 기본 자세 8가지", "30분 아침 루틴 구성", "자세 교정 피드백"],
    targets: ["아침에 몸이 무거운 분", "요가가 처음인 분"],
    materials: ["요가 매트", "편한 운동복"],
    process: ["온라인: 화상 / 오프라인: 마포구 망원한강공원"],
    notes: ["허리·무릎 통증이 있으면 미리 알려주세요", "우천 시 온라인으로 전환해요"],
    schedule: [...weekdays("07:00", "08:30"), { day: 6, start: "08:00", end: "10:00" }],
  },
  t_hobby_01: {
    images: [],
    offerings: ["구도 3분할·대각선 활용", "역광·순광 이해하기", "기본 카메라 앱 보정"],
    targets: ["여행 사진을 잘 찍고 싶은 분", "인물 사진이 늘 아쉬운 분"],
    materials: ["스마트폰 (기종 무관)"],
    process: ["종로 익선동 일대를 함께 걸으며 촬영해요"],
    notes: ["날씨에 따라 장소가 바뀔 수 있어요"],
    schedule: [
      { day: 6, start: "14:00", end: "17:00" },
      { day: 0, start: "14:00", end: "17:00" },
    ],
  },
  t_lang_02: {
    images: [],
    offerings: ["식당·카페 주문 표현", "길 찾기·교통", "쇼핑·계산 표현", "상황별 롤플레이"],
    targets: ["일본 여행을 앞둔 분", "히라가나는 읽을 수 있는 분"],
    materials: ["필기도구", "여행 일정(있으면)"],
    process: ["1시간씩 3회 나눠서 진행해도 돼요", "화상 통화로 진행"],
    notes: ["3시간 연속 진행 시 중간에 10분 쉬어요"],
    schedule: weekdays("19:30", "22:30"),
  },
  t_etc_01: {
    images: [],
    offerings: ["이력서 구조 점검", "프로젝트 경험 서술 방법", "포트폴리오 README 피드백"],
    targets: ["신입·주니어 개발자 지원자", "부트캠프·학원 수료 예정자"],
    materials: ["이력서 PDF", "포트폴리오 링크"],
    process: ["사전에 자료를 보내주시면 미리 검토 후 화상으로 피드백해요"],
    notes: ["개인정보는 가린 버전으로 보내주세요"],
    schedule: [
      { day: 6, start: "15:00", end: "18:00" },
      { day: 0, start: "15:00", end: "18:00" },
    ],
  },
  t_design_02: {
    images: [],
    offerings: ["인터뷰 목적·가설 세우기", "질문지 작성법", "인사이트 정리 템플릿"],
    targets: ["UX 리서치를 처음 해보는 기획자·디자이너"],
    materials: ["노트북", "진행 중인 프로젝트 주제(선택)"],
    process: ["온라인 화상 + 공유 문서로 실습"],
    notes: ["실제 인터뷰 대상자 섭외는 포함되지 않아요"],
    schedule: weekdays("20:00", "22:00"),
  },
};

/** 추가 후기 (mocks/data.ts 의 mockReviews 와 합쳐서 사용) */
export const mockExtraReviews: Review[] = [
  { id: "r_2", tradeId: "tr_x2", talentId: "t_video_01", authorId: "u_sora", targetUserId: "u_jiwoo", rating: 5, content: "자막 템플릿 만드는 법이 특히 좋았어요. 편집 시간이 절반으로 줄었습니다.", createdAt: "2026-10-30T09:00:00.000Z" },
  { id: "r_3", tradeId: "tr_x3", talentId: "t_video_01", authorId: "u_haeun", targetUserId: "u_jiwoo", rating: 4, content: "친절하게 알려주셨어요. 색보정 파트는 조금 더 길었으면 좋겠어요.", createdAt: "2026-10-21T09:00:00.000Z" },
  { id: "r_4", tradeId: "tr_x4", talentId: "t_lang_01", authorId: "u_hyun", targetUserId: "u_sora", rating: 5, content: "틀려도 편하게 말할 수 있는 분위기라 좋았어요. 정리 노트가 큰 도움이 됩니다.", createdAt: "2026-11-06T09:00:00.000Z" },
  { id: "r_5", tradeId: "tr_x5", talentId: "t_lang_01", authorId: "u_jaemin", targetUserId: "u_sora", rating: 5, content: "출장 전에 3번 받았는데 자신감이 확실히 생겼어요.", createdAt: "2026-10-12T09:00:00.000Z" },
  { id: "r_6", tradeId: "tr_x6", talentId: "t_dev_02", authorId: "u_yuna", targetUserId: "u_jaemin", rating: 5, content: "매주 하던 엑셀 정리를 버튼 하나로 끝내게 됐어요!", createdAt: "2026-11-02T09:00:00.000Z" },
  { id: "r_7", tradeId: "tr_x7", talentId: "t_sports_01", authorId: "u_dohyun", targetUserId: "u_yuna", rating: 5, content: "아침 루틴 덕분에 출근길이 가벼워졌어요.", createdAt: "2026-11-09T09:00:00.000Z" },
  { id: "r_8", tradeId: "tr_x8", talentId: "t_design_01", authorId: "u_jiwoo", targetUserId: "u_minho", rating: 5, content: "오토레이아웃이 드디어 이해됐어요. 실습 파일 구성이 깔끔해요.", createdAt: "2026-11-07T09:00:00.000Z" },
  { id: "r_9", tradeId: "tr_x9", talentId: "t_music_01", authorId: "u_minho", targetUserId: "u_hyun", rating: 4, content: "첫 곡을 끝까지 쳤어요! 연습실 위치도 가까워서 좋았습니다.", createdAt: "2026-11-01T09:00:00.000Z" },
  { id: "r_10", tradeId: "tr_x10", talentId: "t_etc_01", authorId: "u_hyun", targetUserId: "u_jaemin", rating: 5, content: "이력서 문장을 어떻게 고쳐야 하는지 구체적으로 알려주셨어요.", createdAt: "2026-10-28T09:00:00.000Z" },
  { id: "r_11", tradeId: "tr_x11", talentId: "t_lang_02", authorId: "u_minho", targetUserId: "u_haeun", rating: 5, content: "여행 가서 실제로 주문할 때 바로 써먹었어요.", createdAt: "2026-11-04T09:00:00.000Z" },
  { id: "r_12", tradeId: "tr_x12", talentId: "t_hobby_01", authorId: "u_sora", targetUserId: "u_dohyun", rating: 5, content: "같은 폰인데 사진이 완전히 달라졌어요.", createdAt: "2026-11-11T09:00:00.000Z" },
];

/** 제공자별 완료 거래 수 [MOCK] — 실제로는 Trade 테이블에서 status=COMPLETED 집계 */
export const mockCompletedTradeCounts: Record<string, number> = {
  u_me: 9,
  u_jiwoo: 27,
  u_minho: 15,
  u_sora: 41,
  u_hyun: 8,
  u_jaemin: 36,
  u_yuna: 17,
  u_dohyun: 14,
  u_haeun: 21,
};
