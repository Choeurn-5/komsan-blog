export type WordPressPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  author: number;
  categories: number[];
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      link?: string;
      avatar_urls?: Record<string, string>;
    }>;
    "wp:featuredmedia"?: Array<{
      id: number;
      date?: string;
      slug?: string;
      source_url: string;
      alt_text?: string;
      caption?: {
        rendered: string;
      };
      media_details?: {
        width?: number;
        height?: number;
        sizes?: Record<
          string,
          {
            source_url: string;
            width: number;
            height: number;
          }
        >;
      };
    }>;
    "wp:term"?: Array<
      Array<{
        id: number;
        name: string;
        slug: string;
        taxonomy: string;
        link?: string;
      }>
    >;
  };
};

export type WordPressCategory = {
  id: number;
  count: number;
  name: string;
  slug: string;
  taxonomy: string;
  link: string;
};

const getApiUrl = () => {
  const url = process.env.WORDPRESS_API_URL;
  if (!url) {
    throw new Error("SERVER CONFIGURATION ERROR: WORDPRESS_API_URL environment variable is missing.");
  }
  return url;
};

export async function getPosts(page: number = 1, perPage: number = 10): Promise<WordPressPost[]> {
  try {
    const url = new URL(`${getApiUrl()}/posts`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("per_page", perPage.toString());
    url.searchParams.append("_embed", "true");
    url.searchParams.append("status", "publish");
    url.searchParams.append("orderby", "date");
    url.searchParams.append("order", "desc");

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`WordPress API Error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const url = new URL(`${getApiUrl()}/posts`);
    url.searchParams.append("slug", encodedSlug);
    url.searchParams.append("_embed", "true");
    url.searchParams.append("status", "publish");

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`WordPress API Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Failed to fetch post by slug:", error);
    return null;
  }
}

export async function getCategories(): Promise<WordPressCategory[]> {
  try {
    const url = new URL(`${getApiUrl()}/categories`);
    url.searchParams.append("per_page", "100");
    url.searchParams.append("hide_empty", "true");

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`WordPress API Error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function getRelatedPosts(categoryId: number, excludePostId: number): Promise<WordPressPost[]> {
  try {
    const url = new URL(`${getApiUrl()}/posts`);
    url.searchParams.append("categories", categoryId.toString());
    url.searchParams.append("exclude", excludePostId.toString());
    url.searchParams.append("per_page", "3");
    url.searchParams.append("_embed", "true");
    url.searchParams.append("status", "publish");

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`WordPress API Error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch related posts:", error);
    return [];
  }
}
