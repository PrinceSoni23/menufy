export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  publishedAt: string;
  image: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "restaurant-qr-menu-advantages",
    title: "Why Restaurant QR Menus Increase Conversion and Repeat Visits",
    description:
      "Discover how QR menus improve ordering speed, guest trust, and revenue with modern restaurant technology.",
    excerpt:
      "A modern QR menu experience helps restaurants update offers instantly and guide guests toward higher-value decisions.",
    category: "Growth",
    tags: ["QR Menu", "Restaurant Growth", "Customer Analytics"],
    author: "Menuffy Team",
    readTime: "5 min read",
    publishedAt: "2026-06-19",
    image: "/logo.png",
    content: [
      "Restaurants that adopt QR-based menus see faster service and more confidence from guests when ordering. A digital experience removes friction and makes updates immediate.",
      "From seasonal specials to bundle offers, a modern menu can support upsells without cluttering the layout. That makes the customer journey more intuitive and efficient.",
      "Menuffy helps brands use restaurant analytics to understand which dishes are resonating and when campaigns should be adjusted.",
    ],
  },
  {
    slug: "contactless-ordering-for-hospitality",
    title: "Contactless Ordering for Hospitality: What Modern Guests Expect",
    description:
      "Learn how contactless ordering supports safer, faster service for cafés, restaurants, hotels, and events.",
    excerpt:
      "Consumers expect convenience and speed. Contactless ordering fits naturally into the way hospitality brands serve guests today.",
    category: "Operations",
    tags: ["Contactless Ordering", "Hospitality Software"],
    author: "Menuffy Team",
    readTime: "4 min read",
    publishedAt: "2026-06-12",
    image: "/logo.png",
    content: [
      "Modern guests want control over the ordering experience, from scanning a menu to paying in a few taps. Contactless ordering fits that expectation well.",
      "It reduces bottlenecks during busy periods and enables staff to focus on hospitality rather than repetitive tasks.",
      "For restaurants and hotels, this creates a smoother guest experience while supporting better operations and decision-making.",
    ],
  },
  {
    slug: "restaurant-analytics-actionable-insights",
    title: "Turn Restaurant Analytics Into Actionable Growth Strategies",
    description:
      "Understand how live reporting helps restaurants spot demand shifts, optimize menus, and grow revenue.",
    excerpt:
      "Analytics should not just report numbers. They should guide smarter menu adjustments and customer-focused strategy.",
    category: "Analytics",
    tags: ["Restaurant Analytics", "Restaurant Growth"],
    author: "Menuffy Team",
    readTime: "6 min read",
    publishedAt: "2026-05-28",
    image: "/logo.png",
    content: [
      "The most useful restaurant analytics connect behavior signals to operational actions. When a dish suddenly drops in engagement, the team needs to know why.",
      "Menuffy gives operators insight into what guests are exploring, which items drive value, and where to test new messaging.",
      "That turns data into a more confident menu strategy rather than a passive scorecard.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find(post => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string) {
  return blogPosts.filter(post => post.slug !== currentSlug).slice(0, 3);
}
