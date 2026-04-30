export type NewsItem = {
  id: string;
  category: "Trending" | "New Opening" | "Award" | "Event" | "Chef" | "Guide";
  title: string;
  summary: string;
  body: string;
  image: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readMinutes: number;
  tags: string[];
};
