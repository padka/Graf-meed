import React from 'react';
import './CartItem.css'; // Убедитесь, что указан правильный путь к CSS файлу

function CartItem({ item, updateQuantity, removeItem }) {
    const decreaseQuantity = () => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        }
    };

    const increaseQuantity = () => {
        updateQuantity(item.id, item.quantity + 1);
    };

    return (
        <div className="cart-item">
            <img src={item.image} alt={item.title} className="cart-item-image" />
            <div className="cart-item-details">
                <h4 className="cart-item-title">{item.title}</h4>
                <div className="cart-item-quantity">
                    <button onClick={decreaseQuantity} aria-label="Уменьшить количество">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={increaseQuantity} aria-label="Увеличить количество">+</button>
                </div>
                <div className="cart-item-price">
                    {`${item.price} RUB`}
                </div>
                <button onClick={() => removeItem(item.id)} className="cart-item-remove" aria-label="Удалить товар">Удалить</button>
            </div>
        </div>
    );
}

export default CartItem;
