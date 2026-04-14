# Digital Curator — 퍼스널 지식 아카이브 블로그

> 공부한 내용을 기술해두고 필요할 때마다 참고할 수 있는 지식 아카이브.

## 기술 스택

- **Language:** TypeScript 5 (strict mode)
- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4 (`@theme` inline config, tailwind.config.ts 없음)
- **Content:** `@mdx-js/mdx` + `gray-matter`
- **Font:** Pretendard (로컬 woff2, body/label), Newsreader (Google Fonts, headline)
- **Testing:** Vitest + React Testing Library
- **Package Manager:** pnpm

## 명령어

```bash
pnpm dev          # 개발 서버 (http://localhost:4000)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버
pnpm test         # Vitest 실행
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

## 프로젝트 구조

```
content/posts/        게시글 MDX 파일 (파일명 = slug)
public/fonts/         Pretendard woff2
public/images/posts/  포스트 이미지
src/app/              페이지/라우트
src/components/       UI 컴포넌트 (layout/, post/, ui/)
src/lib/              유틸리티 (posts.ts, mdx.ts, fonts.ts)
src/styles/           globals.css (@theme 토큰)
src/types/            타입 정의
```

## 코드 스타일

```tsx
// 컴포넌트: PascalCase named export
export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group cursor-pointer">
      <h3 className="font-headline text-3xl font-semibold italic">
        {post.title}
      </h3>
    </article>
  );
}
```

```ts
// 유틸: camelCase named export
export async function getAllPosts(): Promise<Post[]> { ... }
```

### 네이밍 규칙

- 컴포넌트 파일: kebab-case (`post-card.tsx`) — Next.js 규약 파일은 예외 (`page.tsx`, `layout.tsx`)
- 컴포넌트 함수: PascalCase (`PostCard`)
- 유틸/lib 함수: camelCase (`getAllPosts`)
- 타입: PascalCase interface (`Post`, `Frontmatter`)
- `default export` 지양, `named export` 사용 — Next.js 페이지(`page.tsx`)는 `default export` 필수

### 디자인 규칙

- **Design Tokens:** `src/styles/globals.css`의 `@theme` 블록이 single source of truth
- **No-Line Rule:** 섹션 구분에 `border` 금지. 배경색 톤 차이로 구분
- **Tertiary 제한:** 브라이트 옐로우는 작은 디테일에만 사용. 넓은 면적 금지
- **Glassmorphism:** 플로팅 요소에 `backdrop-blur` + 반투명 `surface`

## 프로젝트 문서

`docs/wiki/`에 프로젝트의 구조, 모듈, 컨벤션 등의 문서가 있다.
프로젝트의 구조, 모듈 경계, 코딩 패턴 등 컨텍스트가 필요할 때 `docs/wiki/`가 존재하면 참고한다.
단, wiki는 보조 자료이다. 코드가 진실이므로 wiki와 코드가 다르면 코드를 따른다.

- 최초 생성: `/project`
- 갱신: `/wiki`

## 워크플로우

이 프로젝트는 `.claude/` 디렉토리의 commands, skills, hooks를 활용한다.

### 새 프로젝트 시작

`/spec` → `/plan` → `/build` 반복 → `/code-review` → `/ship`

1. `/spec` — 요구사항을 구조화된 스펙으로 정리. 불명확한 부분은 질문한다.
2. `/project` — 초기 프로젝트 구조가 잡힌 후 wiki 문서를 생성한다.
3. `/plan` — 스펙을 수직 슬라이스로 작업 분해. wiki를 참고해 범위를 좁힌다.
4. `/build` — 각 작업을 TDD로 구현. RED → GREEN → 리팩터링 → 커밋.
5. `/code-review` → `/ship` — 5축 리뷰 후 배포 체크리스트 실행.

### 기존 프로젝트에 기능 추가

`/plan` → `/build` 반복 → `/code-review`

스펙 없이 `/plan`부터 시작한다. 기존 코드 패턴을 파악하고 일관된 방식으로 구현한다.
기능이 크거나 요구사항이 모호하면 `/spec`부터 시작해도 좋다.

### 버그 수정

`/test` → `/code-review`

Prove-It 패턴을 따른다:
1. 버그를 재현하는 테스트 작성 (반드시 FAIL 확인)
2. 근본 원인 수정 (증상이 아닌 원인)
3. 테스트 통과 확인 + 전체 스위트로 회귀 확인

### 코드 정리

`/code-simplify` → `/code-review`

동작 변경 없이 구조만 개선한다. 기능 추가와 리팩토링을 섞지 않는다.

### 배포 전 점검

`/ship`

코드 품질, 보안, 성능, 접근성, 인프라, 문서를 전체 점검한다.

### 프로젝트 문서화

`/project` (최초) → `/wiki` (갱신)

`/project`로 코드베이스를 분석하여 `docs/wiki/`에 문서를 생성한다.
이후 구조 변경 시 `/wiki`로 해당 문서를 갱신한다.

### 간단한 수정

별도 커맨드 없이 직접 요청한다. 변경 범위가 작으면 `/code-review`도 생략 가능하다.

## 경계

### Always
- 코드 변경 전 관련 테스트 확인
- 커밋 전 `pnpm test && pnpm build && pnpm lint` 실행
- 기존 코드 패턴과 컨벤션 따르기
- Design Tokens은 `src/styles/globals.css`의 `@theme` 블록을 single source of truth로 사용
- 콘텐츠(MDX)와 코드 분리 유지 (`content/` vs `src/`)
- 입력값은 시스템 경계에서 검증

### Ask First
- 새 의존성 추가
- 프로젝트 구조 변경
- Design Token 값 변경
- 카테고리 체계 변경
- CI/CD 설정 변경

### Never
- 시크릿을 코드에 하드코딩
- 테스트 없이 머지
- 실패하는 테스트를 삭제하여 CI 통과
- `globals.css` `@theme` 토큰을 확인 없이 임의 변경
- Tertiary(옐로우) 색상을 넓은 면적에 사용
- vendor 디렉토리 직접 수정
