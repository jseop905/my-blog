# Digital Curator MVP — Task List

## Phase 1: Foundation

- [x] **Task 1: Project Scaffold** [M]
  Next.js 16 + TS strict + Tailwind v4 + Vitest + ESLint + Prettier + pnpm + port 4000
  Pretendard woff2 4개 → `public/fonts/`

- [x] **Task 2: Design System (Tokens + Fonts)** [S]
  `globals.css` @theme 블록 + `fonts.ts` (Pretendard local + Newsreader google) + `layout.tsx` 폰트 적용

- [x] **Task 3: Content Data Layer** [M]
  `types/post.ts` + `lib/posts.ts` + `lib/mdx.ts` + 샘플 MDX 3개 + 테스트

### --- Checkpoint: Foundation ---

## Phase 2: Layout + Pages

- [x] **Task 4: Layout Shell (Header + Footer)** [M]
  Glassmorphism Header + Footer + 반응형 root layout

- [x] **Task 5: Home Page** [M]
  PostCard + PostList + 홈 (피처드/최신 섹션 + 사이드바 카테고리)

- [x] **Task 6: Post Detail Page** [M]
  PostContent (MDX 렌더러) + `/posts/[slug]` + generateStaticParams + SEO

- [x] **Task 7: Archive Page + Category Filter** [M]
  CategoryFilter (client) + Archive 페이지 + URL 기반 필터링

### --- Checkpoint: All Pages ---

## Phase 3: Polish

- [x] **Task 8: Responsive + Accessibility + Final QA** [M]
  반응형 점검 + 시맨틱 HTML + 접근성 + SPEC.md Success Criteria 9개 충족
