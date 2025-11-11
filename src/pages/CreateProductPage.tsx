import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProductStore } from '@/store/productStore';
import './CreateProductPage.css';

const schema = z.object({
  title: z.string().min(4, 'Минимум 4 символа'),
  description: z.string().min(10, 'Минимум 10 символов'),
  price: z
    .number({ invalid_type_error: 'Цена обязательна' })
    .min(0, 'Цена не может быть отрицательной'),
  category: z.string().min(3, 'Минимум 3 символа'),
  image: z.string().url('Укажите корректный URL')
});

export type CreateProductFormValues = z.infer<typeof schema>;

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { createProduct, categories, fetchProducts, loaded, loading } = useProductStore((state) => ({
    createProduct: state.createProduct,
    categories: state.categories,
    fetchProducts: state.fetchProducts,
    loaded: state.loaded,
    loading: state.loading
  }));

  useEffect(() => {
    if (!loaded && !loading) {
      void fetchProducts();
    }
  }, [fetchProducts, loaded, loading]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      category: '',
      image: ''
    }
  });

  const onSubmit = (values: CreateProductFormValues) => {
    const created = createProduct(values);
    reset();
    navigate(`/products/${created.id}`);
  };

  return (
    <section className="create-product">
      <header className="create-product__header">
        <h1 className="create-product__title">Создать продукт</h1>
        <p className="create-product__subtitle">
          Заполните форму ниже, чтобы добавить собственную карточку в общий каталог.
        </p>
      </header>

      <form className="create-product__form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="create-product__grid">
          <label className="create-product__field">
            <span>Название</span>
            <input type="text" {...register('title')} placeholder="Например, Умные часы" />
            {errors.title ? <span className="create-product__error">{errors.title.message}</span> : null}
          </label>

          <label className="create-product__field">
            <span>Цена</span>
            <input type="number" step="0.01" min="0" {...register('price', { valueAsNumber: true })} />
            {errors.price ? <span className="create-product__error">{errors.price.message}</span> : null}
          </label>

          <label className="create-product__field">
            <span>Категория</span>
            <input type="text" list="category-list" {...register('category')} placeholder="Например, electronics" />
            <datalist id="category-list">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
            {errors.category ? <span className="create-product__error">{errors.category.message}</span> : null}
          </label>

          <label className="create-product__field create-product__field--wide">
            <span>Изображение (URL)</span>
            <input type="url" {...register('image')} placeholder="https://..." />
            {errors.image ? <span className="create-product__error">{errors.image.message}</span> : null}
          </label>

          <label className="create-product__field create-product__field--wide">
            <span>Описание</span>
            <textarea rows={5} {...register('description')} placeholder="Кратко опишите продукт" />
            {errors.description ? <span className="create-product__error">{errors.description.message}</span> : null}
          </label>
        </div>

        <div className="create-product__actions">
          <button type="submit" className="create-product__primary" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Создать продукт'}
          </button>
          <button
            type="button"
            className="create-product__secondary"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Очистить
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateProductPage;
