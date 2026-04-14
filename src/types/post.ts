export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  categories: string[];
  tags?: string[];
  thumbnail?: string;
  pinned?: boolean;
  published?: boolean;
}

export interface Post extends Frontmatter {
  slug: string;
}

export interface PostWithContent extends Post {
  content: string;
}
