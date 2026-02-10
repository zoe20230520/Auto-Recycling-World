export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  author: string;
  category_id: string | null;
  published_date: string;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
}

// 示例数据
const categoriesData: Category[] = [
  { id: '1', name: 'Industry News', slug: 'industry-news', created_at: '2025-01-01T00:00:00Z' },
  { id: '2', name: 'Technology', slug: 'technology', created_at: '2025-01-01T00:00:00Z' },
  { id: '3', name: 'Sustainability', slug: 'sustainability', created_at: '2025-01-01T00:00:00Z' },
  { id: '4', name: 'Market Analysis', slug: 'market-analysis', created_at: '2025-01-01T00:00:00Z' },
  { id: '5', name: 'Best Practices', slug: 'best-practices', created_at: '2025-01-01T00:00:00Z' },
];

const articlesData: (Article & { categories?: Category | null })[] = [
  {
    id: '1',
    title: 'Automotive Recycling Industry Sees Record Growth in 2025',
    slug: 'automotive-recycling-industry-record-growth-2025',
    excerpt: 'The global automotive recycling industry has experienced unprecedented growth this year, driven by increasing environmental regulations and consumer awareness.',
    content: `The global automotive recycling industry has experienced unprecedented growth in 2025, driven by increasing environmental regulations and consumer awareness about sustainability. According to recent reports, the market has expanded by over 15% compared to the previous year, with projections indicating continued momentum through the next decade.

Key factors contributing to this growth include:
- Stricter environmental regulations worldwide
- Rising demand for recycled materials in manufacturing
- Advancements in recycling technologies
- Growing consumer preference for sustainable products

Industry experts predict that the automotive recycling sector will continue to evolve, with new opportunities emerging in electric vehicle battery recycling and advanced material recovery processes.`,
    image_url: null,
    author: 'Sarah Johnson',
    category_id: '1',
    published_date: '2025-02-01',
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-01T00:00:00Z',
    categories: categoriesData[0],
  },
  {
    id: '2',
    title: 'New AI Technology Revolutionizes Parts Sorting',
    slug: 'new-ai-technology-revolutionizes-parts-sorting',
    excerpt: 'Artificial intelligence is transforming how automotive recyclers identify and sort parts, improving efficiency and accuracy across the industry.',
    content: `Artificial intelligence is transforming how automotive recyclers identify and sort parts, improving efficiency and accuracy across the industry. This groundbreaking technology uses machine learning algorithms to recognize and categorize components with near-perfect accuracy.

The benefits of AI-powered sorting include:
- 95% accuracy in part identification
- 40% reduction in processing time
- Lower labor costs
- Improved material recovery rates

Leading recycling facilities have reported significant improvements in their operations after implementing these systems. The technology is particularly effective in distinguishing between similar-looking parts and identifying valuable components that might otherwise be missed.`,
    image_url: null,
    author: 'Michael Chen',
    category_id: '2',
    published_date: '2025-01-28',
    created_at: '2025-01-28T00:00:00Z',
    updated_at: '2025-01-28T00:00:00Z',
    categories: categoriesData[1],
  },
  {
    id: '3',
    title: 'Electric Vehicle Battery Recycling: Challenges and Opportunities',
    slug: 'electric-vehicle-battery-recycling-challenges-opportunities',
    excerpt: 'As EV adoption accelerates, the recycling industry faces new challenges in handling lithium-ion batteries while discovering valuable opportunities.',
    content: `As electric vehicle adoption accelerates worldwide, the recycling industry faces new challenges in handling lithium-ion batteries while discovering valuable opportunities in this emerging market. The first wave of mass-produced EVs is now reaching end-of-life, creating urgent needs for effective recycling solutions.

Current challenges include:
- Complex battery chemistries requiring specialized processing
- Safety concerns during dismantling and transport
- Evolving regulatory frameworks
- Infrastructure requirements for large-scale recycling

However, these challenges also present significant opportunities:
- Recovery of valuable materials (lithium, cobalt, nickel)
- Development of new recycling technologies
- Growing market for recycled battery materials
- Potential for circular economy in EV manufacturing

Industry leaders are investing heavily in R&D to develop efficient and cost-effective recycling processes.`,
    image_url: null,
    author: 'Emily Rodriguez',
    category_id: '3',
    published_date: '2025-01-25',
    created_at: '2025-01-25T00:00:00Z',
    updated_at: '2025-01-25T00:00:00Z',
    categories: categoriesData[2],
  },
  {
    id: '4',
    title: 'Market Analysis: Steel Prices Impact on Recycling Margins',
    slug: 'market-analysis-steel-prices-impact-recycling-margins',
    excerpt: 'Fluctuating steel prices are significantly affecting profit margins for automotive recyclers, requiring strategic adjustments in operations.',
    content: `Fluctuating steel prices are significantly affecting profit margins for automotive recyclers, requiring strategic adjustments in operations. The past year has seen steel prices experience substantial volatility, creating both challenges and opportunities for the recycling sector.

Market analysts note several key trends:
- Steel prices have varied by over 30% in the past 12 months
- Global supply chain disruptions continue to impact pricing
- Demand from construction and manufacturing sectors remains strong
- Trade policies and tariffs add complexity to price forecasts

Successful recyclers are adapting by:
- Diversifying their material recovery focus
- Implementing better inventory management
- Building strategic partnerships with buyers
- Investing in processing efficiency improvements

Looking ahead, experts recommend careful market monitoring and flexible operational strategies to navigate the uncertain pricing environment.`,
    image_url: null,
    author: 'David Thompson',
    category_id: '4',
    published_date: '2025-01-20',
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-01-20T00:00:00Z',
    categories: categoriesData[3],
  },
  {
    id: '5',
    title: 'Best Practices: Implementing Sustainable Operations',
    slug: 'best-practices-implementing-sustainable-operations',
    excerpt: 'Learn how leading recycling facilities are adopting sustainable practices that benefit both the environment and their bottom line.',
    content: `Leading recycling facilities are increasingly adopting sustainable practices that benefit both the environment and their bottom line. These best practices demonstrate how environmental responsibility can align with business success.

Key sustainable practices include:
- Energy-efficient processing equipment
- Water conservation and recycling systems
- Renewable energy adoption (solar, wind)
- Waste reduction programs
- Sustainable transportation for logistics

Success stories from industry leaders show:
- Up to 40% reduction in energy consumption
- Significant cost savings from efficiency improvements
- Enhanced brand reputation and customer loyalty
- Compliance advantage with environmental regulations
- Improved employee satisfaction and retention

Implementation strategies:
1. Conduct baseline sustainability assessments
2. Set measurable goals and targets
3. Invest in proven technologies
4. Train staff on new procedures
5. Monitor and report progress regularly

The path to sustainability requires commitment and investment, but the returns in efficiency, cost savings, and market positioning make it a wise business decision.`,
    image_url: null,
    author: 'Lisa Park',
    category_id: '5',
    published_date: '2025-01-15',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z',
    categories: categoriesData[4],
  },
  {
    id: '6',
    title: 'Breakthrough in Aluminum Recovery Technology',
    slug: 'breakthrough-aluminum-recovery-technology',
    excerpt: 'A new technology for aluminum recovery is changing the economics of automotive recycling, offering higher yields and lower costs.',
    content: `A revolutionary new technology for aluminum recovery is changing the economics of automotive recycling, offering significantly higher yields and lower operational costs. This breakthrough could reshape how the industry handles aluminum-rich components from end-of-life vehicles.

The technology features:
- Advanced separation techniques for aluminum alloys
- Near-100% recovery rates for pure aluminum
- Lower energy consumption than traditional methods
- Ability to process mixed metal streams effectively

Industry impact:
- 25% increase in overall aluminum recovery
- 30% reduction in processing costs
- Improved quality of recovered aluminum
- New opportunities for value-added products

Early adopters of this technology report substantial improvements in their bottom line. The system pays for itself within 18 months through increased revenue and reduced operational expenses.

As the automotive industry increases its use of aluminum to improve fuel efficiency, this technology becomes increasingly valuable. Analysts predict widespread adoption over the next five years as facilities upgrade their capabilities.`,
    image_url: null,
    author: 'Robert Williams',
    category_id: '2',
    published_date: '2025-01-10',
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z',
    categories: categoriesData[1],
  },
];

// 数据库查询方法（使用内存数据）
export const dbQuery = {
  getCategories: (): Category[] => {
    return [...categoriesData];
  },

  getArticles: (): (Article & { categories?: Category | null })[] => {
    return [...articlesData];
  },

  getArticleById: (id: string): (Article & { categories?: Category | null }) | undefined => {
    return articlesData.find(article => article.id === id);
  },
};

export default dbQuery;
