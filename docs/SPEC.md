# Spec: Digital Curator — 퍼스널 지식 아카이브 블로그

## Objective

공부한 내용을 기술해두고 필요할 때마다 참고할 수 있는 **퍼스널 지식 아카이브**를 구축한다.
단순 블로그가 아닌, 장기적으로 RAG 등에 활용 가능한 **구조화된 콘텐츠 저장소**를 지향한다.

### 사용자

- 1인 운영 (작성자 = 관리자)
- 독자는 개발자 및 기술에 관심 있는 일반 사용자

### MVP 페이지

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 홈 | `/` | 피처드 포스트 + 최신 포스트. 운영자가 자주 커스텀하는 쇼케이스 |
| 아카이브 | `/archive` | 전체 포스트 목록 + 카테고리 필터링 |
| 포스트 상세 | `/posts/[slug]` | MDX 렌더링 + 이미지 + 메타데이터 |

> **MVP 제외:** 소개(About) 페이지, 검색, 다크 모드

---

## Tech Stack

| 영역 | 기술 | 비고 |
|------|------|------|
| Framework | Next.js 16 (App Router) | React 19 |
| Language | TypeScript 5 | strict mode |
| Styling | Tailwind CSS v4 | `@theme` inline config (tailwind.config.ts 없음) |
| Content | `@mdx-js/mdx` + `gray-matter` | 빌드 타임 정적 생성 |
| Font | Pretendard (body/label), Newsreader (headline) | Pretendard: 로컬 woff2, Newsreader: Google Fonts |
| Testing | Vitest + React Testing Library | |
| Lint | ESLint + Prettier | Next.js 기본 룰셋 |
| Package Manager | pnpm | |
| Deploy | Vercel | MVP 완료 후 진행 |

---

## Commands

```bash
pnpm dev          # 개발 서버 (http://localhost:4000)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버
pnpm test         # Vitest 실행
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

---

## Project Structure

```
my-blog/
├── content/
│   └── posts/                  # 게시글 MDX 파일
│       ├── clean-architecture.mdx
│       └── editorial-design.mdx
├── public/
│   ├── fonts/                  # Pretendard woff2 (빌드 시 서빙)
│   │   ├── Pretendard-Regular.woff2
│   │   ├── Pretendard-Medium.woff2
│   │   ├── Pretendard-SemiBold.woff2
│   │   └── Pretendard-Bold.woff2
│   └── images/
│       └── posts/              # 포스트 썸네일 및 본문 이미지
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 루트 레이아웃 (Header, Footer, 폰트 로딩)
│   │   ├── page.tsx            # 홈
│   │   ├── archive/
│   │   │   └── page.tsx        # 아카이브
│   │   └── posts/
│   │       └── [slug]/
│   │           └── page.tsx    # 포스트 상세
│   ├── components/
│   │   ├── layout/             # Header, Footer, Sidebar
│   │   ├── post/               # PostCard, PostList, PostContent
│   │   └── ui/                 # Button, Tag, CategoryFilter 등
│   ├── lib/
│   │   ├── fonts.ts            # next/font/local Pretendard + Newsreader 설정
│   │   ├── mdx.ts              # MDX 컴파일 · 직렬화
│   │   └── posts.ts            # 포스트 조회 · 정렬 · 필터
│   ├── styles/
│   │   └── globals.css         # @theme 토큰 + @font-face + 글로벌 스타일
│   └── types/
│       └── post.ts             # Post, Frontmatter 타입
├── docs/                       # 기획, 디자인, 스펙 문서
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

### 콘텐츠 관리

- **게시글:** `content/posts/*.mdx` — 파일명이 곧 slug (`clean-architecture.mdx` → `/posts/clean-architecture`)
- **이미지:** `public/images/posts/` — 포스트 내에서 `/images/posts/파일명`으로 참조
- **폰트:** `public/fonts/` — `docs/font/`의 원본에서 필요한 웨이트만 복사하여 사용

---

## Content Format

### Frontmatter

```yaml
---
title: "클린 아키텍처의 재해석"
description: "유지보수 가능한 시스템 설계를 위한 계층화 전략"
date: "2024-05-24"
categories:
  - "Architecture"
  - "DevOps"
tags:
  - "clean-architecture"
  - "system-design"
thumbnail: "/images/posts/clean-architecture.jpg"
pinned: false
published: true
---
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | O | 포스트 제목 |
| `description` | string | O | 요약 (목록에 노출) |
| `date` | string (YYYY-MM-DD) | O | 작성일 |
| `categories` | string[] | O | 카테고리 (flat, 복수 선택 가능) |
| `tags` | string[] | X | 세부 태그 |
| `thumbnail` | string | X | 썸네일 이미지 경로 |
| `pinned` | boolean | X | `true`면 홈 피처드 영역에 노출 (기본값 `false`) |
| `published` | boolean | X | `false`면 빌드에서 제외 (기본값 `true`) |

### 홈 페이지 구성 로직

1. **피처드 섹션:** `pinned: true`인 포스트를 `date` 내림차순으로 노출
2. **최신 섹션:** 나머지 포스트를 `date` 내림차순으로 노출

> 운영자가 피처드 영역을 커스텀하려면 해당 포스트의 `pinned` 값만 토글하면 된다.

---

## Design Tokens

> **구현 기준은 이 섹션이다.** `DESIGN.md`와 `code.html`은 참고 자료일 뿐, 토큰 값이 다르면 이 스펙을 따른다.

### Colors

```css
@theme {
  /* Primary */
  --color-primary: #532aa8;
  --color-primary-container: #6b46c1;
  --color-on-primary: #ffffff;
  --color-on-primary-container: #e1d2ff;
  --color-primary-fixed: #e9ddff;
  --color-primary-fixed-dim: #d0bcff;
  --color-inverse-primary: #d0bcff;

  /* Secondary */
  --color-secondary: #645787;
  --color-on-secondary: #ffffff;
  --color-secondary-container: #d7c6fe;
  --color-on-secondary-container: #5e5080;
  --color-secondary-fixed: #e9ddff;
  --color-secondary-fixed-dim: #cfbef5;

  /* Tertiary (Accent — 제한적 사용) */
  --color-tertiary: #6b5f00;
  --color-on-tertiary: #ffffff;
  --color-tertiary-container: #bfac2e;
  --color-on-tertiary-container: #494000;
  --color-tertiary-fixed: #fae361;
  --color-tertiary-fixed-dim: #dcc748;

  /* Surface */
  --color-background: #f9f9ff;
  --color-on-background: #121c2c;
  --color-surface: #f9f9ff;
  --color-on-surface: #121c2c;
  --color-surface-variant: #d9e3f9;
  --color-on-surface-variant: #494453;
  --color-surface-dim: #d0daf0;
  --color-surface-bright: #f9f9ff;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f0f3ff;
  --color-surface-container: #e7eeff;
  --color-surface-container-high: #dee8ff;
  --color-surface-container-highest: #d9e3f9;
  --color-surface-tint: #6b46c1;
  --color-inverse-surface: #273141;
  --color-inverse-on-surface: #ebf1ff;

  /* Outline */
  --color-outline: #7a7484;
  --color-outline-variant: #cbc3d5;

  /* Error */
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;
  --color-error-container: #ffdad6;
  --color-on-error-container: #93000a;
}
```

### Typography

```css
@theme {
  --font-headline: "Newsreader", serif;
  --font-body: "Pretendard", sans-serif;
  --font-label: "Pretendard", sans-serif;
}
```

| 용도 | 폰트 | 로딩 방식 | 비고 |
|------|------|-----------|------|
| Display / Headline | Newsreader (italic) | Google Fonts (`next/font/google`) | 포스트 제목, 섹션 헤더 |
| Body / UI | Pretendard | 로컬 woff2 (`next/font/local`) | 본문, 네비게이션, 버튼 |
| Label / Code | Pretendard | 로컬 woff2 (`next/font/local`) | 메타데이터, 태그, 날짜 |

- Pretendard woff2 원본: `docs/font/` → 빌드용: `public/fonts/`
- 사용 웨이트: Regular(400), Medium(500), SemiBold(600), Bold(700) — 나머지는 필요 시 추가
- 본문 `line-height`: 1.6~1.8 (한국어 가독성)
- 자간/행간: 일반 웹 기준 대비 5~10% 넓게

### Border Radius

```css
@theme {
  --radius: 0.125rem;       /* 기본 (아키텍처적 느낌) */
  --radius-lg: 0.25rem;
  --radius-xl: 0.5rem;
  --radius-full: 0.75rem;   /* 인터랙티브 요소 */
}
```

### Core Design Rules

1. **No-Line Rule:** 섹션 구분에 `border` 사용 금지. 배경색 변화(`surface` 톤 차이)로만 구분
2. **Tonal Layering:** `surface` → `surface-container-low` → `surface-container-lowest` 순으로 부상 효과
3. **Ambient Shadow:** 불가피한 경우 `opacity 4~8%`, `blur 20px+`의 극도로 확산된 그림자만 허용
4. **Ghost Border:** 접근성 필요 시 `outline-variant` 투명도 10~20%만 허용
5. **Glassmorphism:** 플로팅 요소(네비게이션 등)에 `backdrop-blur` + 반투명 `surface` 적용
6. **Tertiary 제한:** 브라이트 옐로우는 코드 하이라이트, 태그 점 등 작은 디테일에만 사용. 넓은 면적 금지

---

## Code Style

### 컴포넌트 패턴

```tsx
// src/components/post/PostCard.tsx
interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group cursor-pointer">
      <h3 className="font-headline text-3xl font-semibold italic">
        {post.title}
      </h3>
      <p className="font-body text-on-surface-variant leading-relaxed">
        {post.description}
      </p>
    </article>
  );
}
```

### 데이터 함수 패턴

```ts
// src/lib/posts.ts
export async function getAllPosts(): Promise<Post[]> {
  // content/posts/ 디렉토리에서 .mdx 파일 읽기
  // gray-matter로 frontmatter 파싱
  // date 내림차순 정렬
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // 단일 포스트 조회 + MDX 컴파일
}
```

### Conventions

- 컴포넌트: PascalCase 함수 컴포넌트 (`export function ComponentName`)
- 파일명: kebab-case (`post-card.tsx`) — 단, Next.js 규약 파일(`page.tsx`, `layout.tsx`)은 예외
- 유틸/lib: camelCase 함수 (`getAllPosts`)
- 타입: PascalCase interface (`Post`, `Frontmatter`)
- `default export` 지양, `named export` 사용 — 단, Next.js 페이지(`page.tsx`)는 `default export` 필수

---

## Testing Strategy

| 레벨 | 대상 | 도구 |
|------|------|------|
| Unit | `lib/` 유틸 함수 (포스트 조회, 정렬, 필터) | Vitest |
| Component | 주요 UI 컴포넌트 렌더링 | Vitest + React Testing Library |
| E2E | MVP 범위 외 | 추후 Playwright 고려 |

### 테스트 파일 위치

```
src/
├── lib/
│   ├── posts.ts
│   └── __tests__/
│       └── posts.test.ts
├── components/
│   ├── post/
│   │   ├── PostCard.tsx
│   │   └── __tests__/
│   │       └── PostCard.test.tsx
```

### 테스트 우선순위

1. `lib/posts.ts` — 포스트 조회, 정렬, 카테고리 필터링 로직
2. `lib/mdx.ts` — MDX 컴파일 정상 동작
3. 컴포넌트 — PostCard, CategoryFilter 렌더링

---

## Boundaries

### Always

- 코드 변경 전 관련 테스트 확인
- 커밋 전 `pnpm test && pnpm build && pnpm lint` 실행
- 기존 코드 패턴과 컨벤션 준수
- Design Tokens은 이 스펙의 값을 single source of truth로 사용
- 콘텐츠(MDX)와 코드 분리 유지 (`content/` vs `src/`)

### Ask First

- 새 의존성 추가
- 프로젝트 구조 변경
- Design Token 값 변경
- 카테고리 체계 변경

### Never

- 시크릿을 코드에 하드코딩
- 테스트 없이 머지
- `DESIGN.md`/`code.html` 값을 스펙보다 우선 적용
- Tertiary(옐로우) 색상을 넓은 면적에 사용

---

## Success Criteria

- [ ] `pnpm dev`로 개발 서버가 정상 구동된다
- [ ] 홈 페이지에 피처드 포스트와 최신 포스트가 구분되어 노출된다
- [ ] 아카이브 페이지에 전체 포스트가 날짜순으로 나열된다
- [ ] 카테고리 필터를 클릭하면 해당 카테고리의 포스트만 표시된다
- [ ] 포스트 상세 페이지에서 MDX 콘텐츠가 정상 렌더링된다 (제목, 본문, 이미지, 코드 블록)
- [ ] 반응형 레이아웃이 모바일(`< md`)과 데스크톱(`lg`)에서 정상 동작한다
- [ ] `pnpm build`가 에러 없이 완료된다
- [ ] `pnpm test`가 모든 테스트를 통과한다
- [ ] `pnpm lint && pnpm typecheck`가 에러 없이 완료된다

---

## Open Questions

> 현재 없음. 추가 논의 필요 시 이 섹션에 기록한다.
