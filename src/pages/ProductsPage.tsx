import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { useProductStore } from '@/store/productStore';
import type { Product } from '@/types/product';
import './ProductsPage.css';

const ProductsPage = () => {
  const navigate = useNavigate();
  const {
    products,
    categories,
    loading,
    loaded,
    error,
    filter,
    search,
    category,
    currentPage,
    pageSize,
    fetchProducts,
    toggleLike,
    deleteProduct,
    setFilter,
    setSearch,
    setCategory,
    setPage
  } = useProductStore((state) => ({
    products: state.products,
    categories: state.categories,
    loading: state.loading,
    loaded: state.loaded,
    error: state.error,
    filter: state.filter,
    search: state.search,
    category: state.category,
    currentPage: state.currentPage,
    pageSize: state.pageSize,
    fetchProducts: state.fetchProducts,
    toggleLike: state.toggleLike,
    deleteProduct: state.deleteProduct,
    setFilter: state.setFilter,
    setSearch: state.setSearch,
    setCategory: state.setCategory,
    setPage: state.setPage
  }));

  useEffect(() => {
    if (!loaded && !loading) {
      void fetchProducts();
    }
  }, [fetchProducts, loaded, loading]);

  const filteredProducts = useMemo(() => {
    let result: Product[] = products;

    if (filter === 'favorites') {
      result = result.filter((product) => product.liked);
    }

    if (category !== 'all') {
      result = result.filter((product) => product.category === category);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((product) =>
        product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, filter, category, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (currentPage !== safePage) {
      setPage(safePage);
    }
  }, [currentPage, safePage, setPage]);

  const handleOpenProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <section className="products-page">
      <header className="products-page__header">
        <div>
          <h1 className="products-page__title">Каталог продуктов</h1>
          <p className="products-page__subtitle">
            Выберите интересующие карточки, добавьте свои и управляйте избранным.
          </p>
        </div>
        <div className="products-page__actions">
          <div className="products-page__filters">
            <button
              type="button"
              className={`products-page__filter-button${filter === 'all' ? ' products-page__filter-button--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Все
            </button>
            <button
              type="button"
              className={`products-page__filter-button${filter === 'favorites' ? ' products-page__filter-button--active' : ''}`}
              onClick={() => setFilter('favorites')}
            >
              Избранные
            </button>
          </div>
          <div className="products-page__search-group">
            <input
              type="search"
              placeholder="Поиск без отправки..."
              className="products-page__search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select
              className="products-page__select"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="all">Все категории</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {loading && !loaded ? (
        <div className="products-page__state">Загрузка продуктов...</div>
      ) : null}

      {error ? <div className="products-page__state products-page__state--error">{error}</div> : null}

      {!loading && filteredProducts.length === 0 ? (
        <div className="products-page__state">Нет продуктов для отображения</div>
      ) : null}

      <div className="products-page__grid">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onLike={toggleLike}
            onDelete={deleteProduct}
            onOpen={handleOpenProduct}
          />
        ))}
      </div>

      {filteredProducts.length > pageSize ? (
        <div className="products-page__pagination">
          <button
            type="button"
            className="products-page__page-button"
            onClick={() => setPage(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
          >
            Назад
          </button>
          <span className="products-page__page-indicator">
            Страница {safePage} из {totalPages}
          </span>
          <button
            type="button"
            className="products-page__page-button"
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
          >
            Вперёд
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default ProductsPage;
