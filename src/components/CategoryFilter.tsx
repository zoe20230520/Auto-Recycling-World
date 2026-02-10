import { Category } from '../lib/api';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Articles
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
