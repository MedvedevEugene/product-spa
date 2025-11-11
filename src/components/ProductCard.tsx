import type { KeyboardEvent, MouseEvent } from 'react';
import type { Product } from '@/types/product';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onLike: (productId: string) => void;
  onDelete: (productId: string) => void;
  onOpen: (productId: string) => void;
}

const ProductCard = ({ product, onLike, onDelete, onOpen }: ProductCardProps) => {
  const handleLike = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onLike(product.id);
  };

  const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDelete(product.id);
  };

  const handleOpen = () => {
    onOpen(product.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen(product.id);
    }
  };

  return (
    <article
      className="product-card"
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="product-card__image-wrapper">
        <img src={product.image} alt={product.title} className="product-card__image" loading="lazy" />
      </div>
      <div className="product-card__content">
        <header className="product-card__header">
          <h3 className="product-card__title" title={product.title}>
            {product.title}
          </h3>
          <span className="product-card__price">${product.price.toFixed(2)}</span>
        </header>
        <p className="product-card__description" title={product.description}>
          {product.description}
        </p>
        <footer className="product-card__footer">
          <span className="product-card__category">{product.category}</span>
          <div className="product-card__actions">
            <button
              type="button"
              className={`product-card__icon-button${product.liked ? ' product-card__icon-button--active' : ''}`}
              aria-label={product.liked ? 'Убрать из избранного' : 'Добавить в избранное'}
              onClick={handleLike}
            >
              {product.liked ? '❤️' : '🤍'}
            </button>
            <button
              type="button"
              className="product-card__icon-button product-card__icon-button--danger"
              aria-label="Удалить продукт"
              onClick={handleDelete}
            >
              🗑️
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default ProductCard;
