import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useCart } from '../CartContext/CartContext';
import './Catalog.css';

function Catalog({ isHomePage =false}) {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setError(null);
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error(`HTTP error: status ${response.status}`);
                }
                const result = await response.json();
                if (result.success && Array.isArray(result.data)) {
                    setProducts(result.data);
          
                    const extractedCategories = new Set(result.data.map(product => product.category));
                    setCategories(['all', ...extractedCategories]);
                } else {
                    throw new Error('Data is not in expected format');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error.message);
            }
        };
    
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);
        // Here you would implement the cart adding animation
    };

    // Filter products by selected category if not on the home page
    const visibleProducts = isHomePage
        ? products.slice(0, 3)
        : selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <Container className="catalog-container">
            <h2 className="catalog-title">Каталог</h2>
            {error && <div className="alert alert-danger">Error: {error}</div>}
            {!isHomePage && (
                <div className="mb-3">
                    <select
                        className="select-form"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {Array.from(categories).map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <Row>
                {visibleProducts.map(product => (
                    <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="product-card">
                            <Card.Img variant="top" src={product.image} alt={product.title} />
                            <Card.Body>
                                <Card.Title>{product.title}</Card.Title>
                                <Card.Text>{`${product.price} RUB`}</Card.Text>
                                <Button variant="success" onClick={() => handleAddToCart(product)}>
                                    Add to Cart
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Catalog;
