# Implementation Plan: Digital Curator Blog MVP

## Context

"Digital Curator"는 퍼스널 지식 아카이브 블로그로, 현재 코드가 전혀 없는 그린필드 프로젝트이다.
`docs/SPEC.md`에 확정된 스펙을 기반으로 Next.js 16 + Tailwind v4 + MDX 블로그를 처음부터 구축한다.

MVP 목표: 홈(피처드+최신), 아카이브(전체 목록+카테고리 필터), 포스트 상세(MDX 렌더링) 3개 페이지 완성.

## Architecture Decisions

1. **Tailwind v4 `@theme`**: `globals.css` 내 `@theme {}` 블록에 모든 디자인 토큰 정의. `tailwind.config.ts` 없음
2. **MDX 빌드 타임 생성**: `@mdx-js/mdx`로 컴파일, `generateStaticParams`로 정적 생성
3. **파일 시스템 기반 콘텐츠**: `content/posts/*.mdx`, 파일명 = slug
4. **Server Components 기본**: `'use client'`는 인터랙션이 필요한 컴포넌트(`CategoryFilter`)에만 사용
5. **Pretendard 로컬 폰트**: `public/fonts/`에서 `next/font/local`로 로딩, Newsreader는 `next/font/google`

---

## Task List

### Phase 1: Foundation

#### Task 1: Project Scaffold [M]

Next.js 16 프로젝트 초기화. TypeScript strict, Tailwind v4, Vitest, ESLint, Prettier 설정.
디렉토리 스켈레톤 생성. Pretendard woff2 4개 웨이트를 `public/fonts/`로 복사.

**Acceptance criteria:**
- [ ] `pnpm dev` → `http://localhost:4000` 플레이스홀더 렌더링
- [ ] `pnpm build && pnpm test && pnpm lint && pnpm typecheck` 모두 통과
- [ ] `public/fonts/`에 Pretendard woff2 4개 존재

**Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `eslint.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/styles/globals.css` (빈 import), `public/fonts/*.woff2`
**Dependencies:** None

---

#### Task 2: Design System (Tokens + Fonts) [S]

`globals.css`에 SPEC.md의 전체 `@theme` 블록 작성 (colors, typography, radius).
`@font-face` 선언 (Pretendard 4웨이트). `src/lib/fonts.ts`에 `next/font/local` (Pretendard) + `next/font/google` (Newsreader) 설정.
`layout.tsx`에 폰트 CSS 변수 적용, `lang="ko"`, body 클래스 (`bg-surface font-body text-on-background`).

**Acceptance criteria:**
- [ ] `bg-primary`, `text-on-surface`, `font-headline` 등 Tailwind 유틸리티가 올바른 값으로 해석됨
- [ ] Pretendard 본문, Newsreader 헤드라인이 브라우저에서 정상 렌더링
- [ ] `pnpm build` 통과

**Files:** `src/styles/globals.css`, `src/lib/fonts.ts`, `src/app/layout.tsx`
**Dependencies:** Task 1

---

#### Task 3: Content Data Layer [M]

`src/types/post.ts` (Post, Frontmatter 인터페이스).
`src/lib/posts.ts` (`getAllPosts`, `getPostBySlug`, `getPinnedPosts`, `getCategories`).
`src/lib/mdx.ts` (MDX 컴파일 함수).
`content/posts/`에 샘플 MDX 3개 (pinned 1개, 카테고리 다양, published:false 1개).
`src/lib/__tests__/posts.test.ts`, `src/lib/__tests__/mdx.test.ts` 작성.

**Acceptance criteria:**
- [ ] `getAllPosts()` → published만 date 내림차순 반환
- [ ] `getPinnedPosts()` → pinned 포스트만 반환
- [ ] `getPostBySlug('존재하지않음')` → null
- [ ] `getCategories()` → 중복 제거된 카테고리 목록
- [ ] `compileMdx()` → 마크다운 → 렌더링 가능한 결과물
- [ ] `pnpm test` 모든 테스트 통과

**Files:** `src/types/post.ts`, `src/lib/posts.ts`, `src/lib/mdx.ts`, `src/lib/__tests__/posts.test.ts`, `src/lib/__tests__/mdx.test.ts`, `content/posts/*.mdx` x3
**Dependencies:** Task 1

> **Note:** Task 2와 Task 3은 병렬 실행 가능 (서로 의존성 없음)

---

### --- Checkpoint: Foundation ---

프로젝트 컴파일, 포트 4000 구동, 디자인 토큰 활성, 폰트 로딩, 데이터 레이어 테스트 통과.
`pnpm build && pnpm test && pnpm lint && pnpm typecheck` 올 그린.

---

### Phase 2: Layout + Pages

#### Task 4: Layout Shell (Header + Footer) [M]

`src/app/layout.tsx` 완성 (metadata, max-width 컨테이너).
`src/components/layout/header.tsx` — glassmorphism 플로팅 네비게이션 (fixed, backdrop-blur, 반투명 surface). 브랜드명 "Digital Curator" (Newsreader italic), 네비 링크 (홈, 아카이브).
`src/components/layout/footer.tsx` — 브랜드명, 저작권, 링크. ghost border로 상단 구분.
반응형: 모바일/데스크톱 대응.

**Acceptance criteria:**
- [ ] Header: glassmorphism 효과, 네비 링크가 올바른 경로로 이동
- [ ] Footer: 하단 고정, 반응형 레이아웃
- [ ] No-Line Rule 준수 (border 대신 톤 변화 / ghost border)
- [ ] `pnpm build` 통과

**Files:** `src/app/layout.tsx`, `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`
**Dependencies:** Task 2

---

#### Task 5: Home Page [M]

`src/components/post/post-card.tsx` — 썸네일 (grayscale→color hover), 카테고리 라벨, 날짜, 제목 (Newsreader), 설명, 더 읽기 링크. 이미지 좌/우 교차 배치 지원.
`src/components/post/post-list.tsx` — PostCard 리스트 렌더링.
`src/app/page.tsx` — 피처드 섹션 (pinned) + 최신 섹션. 2/3 + 1/3 레이아웃. 사이드바에 카테고리 목록 (카운트 포함, `/archive?category=X` 링크).
`src/components/post/__tests__/post-card.test.tsx`.

**Acceptance criteria:**
- [ ] 피처드 섹션에 `pinned: true` 포스트 노출
- [ ] 최신 섹션에 나머지 포스트 date 내림차순
- [ ] PostCard 이미지 좌/우 교차 (zigzag)
- [ ] 사이드바 카테고리 목록 + 카운트
- [ ] 반응형: 모바일 단일 컬럼, lg 이상 2컬럼
- [ ] `pnpm test` PostCard 테스트 통과

**Files:** `src/app/page.tsx`, `src/components/post/post-card.tsx`, `src/components/post/post-list.tsx`, `src/components/post/__tests__/post-card.test.tsx`
**Dependencies:** Task 3, Task 4

---

#### Task 6: Post Detail Page [M]

`src/components/post/post-content.tsx` — MDX 렌더링 컴포넌트. 커스텀 엘리먼트 매핑:
  - h1/h2: `font-headline` (Newsreader italic)
  - 본문: `font-body`, `leading-relaxed`~`leading-loose` (한국어 1.6~1.8)
  - 코드 블록: `bg-inverse-surface text-inverse-on-surface`, tertiary 하이라이트
  - 이미지: 반응형, rounded-sm
  - 인용문: primary 톤 배경 (No-Line Rule)
`src/app/posts/[slug]/page.tsx` — slug로 포스트 조회, MDX 컴파일, 메타데이터 헤더 (제목/날짜/카테고리), `generateStaticParams`, `generateMetadata`.

**Acceptance criteria:**
- [ ] `/posts/clean-architecture` → MDX 콘텐츠 정상 렌더링 (헤딩, 코드, 이미지)
- [ ] `/posts/nonexistent` → 404
- [ ] `generateStaticParams` → 모든 published 포스트 slug 반환
- [ ] SEO 메타데이터 (title, description) 포스트별 설정
- [ ] 디자인 룰 준수 (코드 블록 inverse-surface, 한국어 행간)

**Files:** `src/components/post/post-content.tsx`, `src/app/posts/[slug]/page.tsx`, `src/components/post/__tests__/post-content.test.tsx`
**Dependencies:** Task 3, Task 4

> **Note:** Task 5와 Task 6은 병렬 실행 가능 (둘 다 Task 3+4에만 의존)

---

#### Task 7: Archive Page + Category Filter [M]

`src/components/ui/category-filter.tsx` — `'use client'` 컴포넌트. 카테고리 태그 목록 + "전체" 옵션. `useSearchParams`로 URL 상태 관리 (`/archive?category=X`). 선택 상태 시각적 하이라이트.
`src/app/archive/page.tsx` — 전체 포스트 목록 + CategoryFilter. `searchParams.category`로 필터링. PostCard/PostList 재사용.
빈 결과 상태 처리.

**Acceptance criteria:**
- [ ] `/archive` → 전체 포스트 날짜순 나열
- [ ] 카테고리 클릭 → URL 업데이트 + 해당 카테고리 포스트만 표시
- [ ] "전체" 클릭 → 필터 해제
- [ ] 결과 없을 때 안내 메시지
- [ ] PostCard 컴포넌트 재사용 (Task 5에서 생성한 것)
- [ ] 키보드 접근성 (Tab, Enter)

**Files:** `src/components/ui/category-filter.tsx`, `src/app/archive/page.tsx`, `src/components/ui/__tests__/category-filter.test.tsx`
**Dependencies:** Task 5 (PostCard 재사용)

---

### --- Checkpoint: All Pages ---

3개 MVP 페이지 동작. 콘텐츠 파이프라인 완성 (MDX → 데이터 레이어 → 페이지).
모든 내부 네비게이션 정상 (PostCard 링크, 네비 링크, 카테고리 링크).
`pnpm build && pnpm test && pnpm lint && pnpm typecheck` 올 그린.

---

### Phase 3: Polish

#### Task 8: Responsive + Accessibility + Final QA [M]

반응형 점검 (375px, 768px, 1440px).
시맨틱 HTML 확인 (`<article>`, `<nav>`, `<aside>`, `<main>`).
접근성: skip-to-content 링크, focus 스타일, alt 텍스트, heading 계층 순서.
디자인 일관성: No-Line Rule, Tonal Layering, Glassmorphism, Tertiary 제한 확인.
전체 검증: `pnpm test && pnpm build && pnpm lint && pnpm typecheck`, SPEC.md Success Criteria 9개 항목 체크.

**Acceptance criteria:**
- [ ] 모바일/태블릿/데스크톱 레이아웃 정상
- [ ] 키보드 네비게이션으로 모든 인터랙티브 요소 접근 가능
- [ ] `console.log`, `any` 타입 없음
- [ ] SPEC.md Success Criteria 9개 항목 모두 충족
- [ ] `pnpm test && pnpm build && pnpm lint && pnpm typecheck` 올 그린

**Files:** 기존 파일 소규모 수정
**Dependencies:** Task 7

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Next.js 16 + `@mdx-js/mdx` 호환성 | 높음 — 프로젝트 차단 가능 | Task 1에서 즉시 검증. 문제 시 Next.js 15.x 폴백 |
| Tailwind v4 `@theme` 문법 | 중간 — 토큰 미해석 시 전체 스타일 깨짐 | Task 2에서 빌드 검증. 공식 문서 참조 |
| MDX + RSC 컴파일 전략 | 중간 — 잘못된 접근 시 Task 6 재작업 | Task 3에서 `evaluate`/`compile` 방식 테스트. 문제 시 `next-mdx-remote` 폴백 |
| 한국어 타이포그래피 튜닝 | 낮음 — 시각적 조정 | Task 8 폴리시 단계에서 반복 조정 |

---

## Execution Order (Sequential)

```
Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 → Task 8
                                       ↑
                              (2, 3 병렬 가능)   (5, 6 병렬 가능)
```

## Verification (Final)

SPEC.md Success Criteria:
1. `pnpm dev` 개발 서버 정상 구동
2. 홈 페이지 피처드/최신 포스트 구분 노출
3. 아카이브 페이지 전체 포스트 날짜순 나열
4. 카테고리 필터 클릭 시 해당 포스트만 표시
5. 포스트 상세에서 MDX 정상 렌더링 (제목, 본문, 이미지, 코드 블록)
6. 반응형 모바일/데스크톱 정상 동작
7. `pnpm build` 에러 없이 완료
8. `pnpm test` 모든 테스트 통과
9. `pnpm lint && pnpm typecheck` 에러 없이 완료
