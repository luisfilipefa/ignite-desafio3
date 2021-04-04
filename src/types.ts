export interface NavPost {
  uid: string;
  title: string;
}

export interface PostProps {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  prev_post: NavPost;
  next_post: NavPost;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

export interface ArticleProps {
  post: PostProps;
  preview: boolean;
}

export interface PreviewProps {
  preview: boolean;
}

export interface ArticleHeaderProps {
  title: string;
  author: string;
  banner_url: string;
  first_publication_date: string;
  last_publication_date: string;
  readingTime: string;
}

export interface ArticleNavProps {
  uid: string;
  prev_post: NavPost;
  next_post: NavPost;
}
