export interface AdminDashboardFoodStat {
  foodId: string;
  name: string;
  count: number;
  imgUrl?: string;
}

export interface AdminDashboardArticleStat {
  articleId: string;
  title: string;
  count: number;
  coverImageUrl?: string;
}

export interface AdminDashboardExcludedFoodStat {
  foodId: string;
  name: string;
  count: number;
  imgUrl?: string;
}

export interface AdminPrimaryDietStat {
  diet: string;
  count: number;
}

export interface AdminDashboardTimeSeriesPoint {
  date: string;
  value: number;
}

export interface AdminDashboardStats {
  totals: {
    users: number;
    foods: number;
    mealPlans: number;
    collections: number;
    foodViews: number;
    articleViews: number;
    curatedCollectionViews: number;
    curatedCollectionCopies: number;
  };
  topViewedFoods: AdminDashboardFoodStat[];
  topFavoritedFoods: AdminDashboardFoodStat[];
  topMealPlanFoods: AdminDashboardFoodStat[];
  topViewedArticles: AdminDashboardArticleStat[];
  topExcludedFoods: AdminDashboardExcludedFoodStat[];
  primaryDiets: AdminPrimaryDietStat[];
  timeSeries: {
    users: AdminDashboardTimeSeriesPoint[];
    foods: AdminDashboardTimeSeriesPoint[];
    curatedCollections: AdminDashboardTimeSeriesPoint[];
    foodViews: AdminDashboardTimeSeriesPoint[];
    mealPlans: AdminDashboardTimeSeriesPoint[];
    favorites: AdminDashboardTimeSeriesPoint[];
    articleViews: AdminDashboardTimeSeriesPoint[];
    curatedCollectionViews: AdminDashboardTimeSeriesPoint[];
    curatedCollectionCopies: AdminDashboardTimeSeriesPoint[];
  };
}
