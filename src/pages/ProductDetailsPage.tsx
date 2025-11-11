import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useProductStore } from '@/store/productStore';
import './ProductDetailsPage.css';

interface ProductFormValues {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const ProductDetailsPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const {
    products,
    loading,
    loaded,
    error,
    fetchProducts,
    toggleLike,
    deleteProduct,
    updateProduct
  } = useProductStore((state) => ({
    products: state.products,
    loading: state.loading,
    loaded: state.loaded,
    error: state.error,
    fetchProducts: state.fetchProducts,
    toggleLike: state.toggleLike,
    deleteProduct: state.deleteProduct,
    updateProduct: state.updateProduct
  }));

  useEffect(() => {
    if (!loaded && !loading) {
      void fetchProducts();
    }
  }, [fetchProducts, loaded, loading]);

  const product = useMemo(() => products.find((item) => item.id === productId), [products, productId]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm<ProductFormValues>({
    values: product
      ? {
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          image: product.image
        }
      : undefined
  });

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image
      });
    }
  }, [product, reset]);

  const handleBack = () => {
    navigate('/products');
  };

  const handleDelete = () => {
    if (!productId) {
      return;
    }

    deleteProduct(productId);
    navigate('/products');
  };

  const handleLike = () => {
    if (productId) {
      toggleLike(productId);
    }
  };

  const onSubmit = (values: ProductFormValues) => {
    if (!productId) {
      return;
    }

    updateProduct(productId, values);
    setIsEditing(false);
  };

  if (!productId) {
    return <div className="product-details__state">Некорректный идентификатор продукта</div>;
  }

  if (loading && !loaded) {
    return <div className="product-details__state">Загрузка продукта...</div>;
  }

  if (error && !product) {
    return <div className="product-details__state product-details__state--error">{error}</div>;
  }

  if (!product) {
    return <div className="product-details__state">Продукт не найден. Возможно, он был удалён.</div>;
  }

  return (
    <section className="product-details">
      <div className="product-details__toolbar">
        <button type="button" className="product-details__back" onClick={handleBack}>
          ← Назад к списку
        </button>
        <div className="product-details__actions">
          <button type="button" className="product-details__secondary" onClick={handleLike}>
            {product.liked ? 'Убрать из избранного' : 'Добавить в избранное'}
          </button>
          <button type="button" className="product-details__secondary" onClick={() => setIsEditing((prev) => !prev)}>
            {isEditing ? 'Отменить' : 'Редактировать'}
          </button>
          <button type="button" className="product-details__danger" onClick={handleDelete}>
            Удалить
          </button>
        </div>
      </div>

      <div className="product-details__body">
        <div className="product-details__image-wrapper">
          <img src={product.image} alt={product.title} className="product-details__image" />
        </div>
        <div className="product-details__info">
          <h1 className="product-details__title">{product.title}</h1>
          <p className="product-details__price">${product.price.toFixed(2)}</p>
          <span className="product-details__category">{product.category}</span>
          <p className="product-details__description">{product.description}</p>
          <p className="product-details__meta">
            Источник: {product.source === 'api' ? 'API' : 'Создан пользователем'} · Добавлен:{' '}
            {new Date(product.createdAt).toLocaleString('ru-RU')}
          </p>
        </div>
      </div>

      {isEditing ? (
        <form className="product-details__form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <h2 className="product-details__form-title">Редактирование продукта</h2>
          <div className="product-details__form-grid">
            <label className="product-details__field">
              <span>Название</span>
              <input
                type="text"
                {...register('title', { required: 'Название обязательно', minLength: { value: 4, message: 'Минимум 4 символа' } })}
              />
              {errors.title ? <span className="product-details__error">{errors.title.message}</span> : null}
            </label>
            <label className="product-details__field">
              <span>Цена</span>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('price', {
                  required: 'Цена обязательна',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Цена должна быть неотрицательной' }
                })}
              />
              {errors.price ? <span className="product-details__error">{errors.price.message}</span> : null}
            </label>
            <label className="product-details__field">
              <span>Категория</span>
              <input
                type="text"
                {...register('category', { required: 'Категория обязательна', minLength: { value: 3, message: 'Минимум 3 символа' } })}
              />
              {errors.category ? <span className="product-details__error">{errors.category.message}</span> : null}
            </label>
            <label className="product-details__field product-details__field--wide">
              <span>Изображение (URL)</span>
              <input
                type="url"
                {...register('image', {
                  required: 'Укажите ссылку на изображение',
                  pattern: { value: /^(https?:\/\/).+/i, message: 'Должна быть валидная ссылка' }
                })}
              />
              {errors.image ? <span className="product-details__error">{errors.image.message}</span> : null}
            </label>
            <label className="product-details__field product-details__field--wide">
              <span>Описание</span>
              <textarea
                rows={4}
                {...register('description', {
                  required: 'Описание обязательно',
                  minLength: { value: 10, message: 'Минимум 10 символов' }
                })}
              />
              {errors.description ? <span className="product-details__error">{errors.description.message}</span> : null}
            </label>
          </div>
          <div className="product-details__form-actions">
            <button type="submit" className="product-details__primary" disabled={!isDirty}>
              Сохранить изменения
            </button>
            <button type="button" className="product-details__secondary" onClick={() => reset()} disabled={!isDirty}>
              Сбросить
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
};

export default ProductDetailsPage;
