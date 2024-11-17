import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import { Card, Button, Row, Col } from 'react-bootstrap'; // Імпортуємо компоненти Bootstrap
import WishlistModal from '../Modals/WishListModal';

export default function RecomendationBar() {
    const { apiRequest, userId, isAuthenticated } = useContext(AuthContext); // Отримуємо контекст для API та ID користувача
    const [products, setProducts] = useState([]);
    const [wishlists, setWishlists] = useState([]); // Стан для збереження списків бажань
    const [selectedProductId, setSelectedProductId] = useState(null); // Стан для вибраного товару
    const [showWishlistModal, setShowWishlistModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Стан для зберігання товарів
    const navigate = useNavigate();

    useEffect(() => {
      async function fetchRecomendationData() {
        try {
            if (isAuthenticated) {
                const response = await apiRequest('GET', `api/users/${userId}/rec`);
                setProducts(response.products);
                console.log(response); 
            }else {
                const response = await apiRequest('GET', `api/products`);
                setProducts(response.products);
                console.log(response); 
            }
        } catch (error) {
          console.error('Failed to fetch recommendation data:', error);
        }
      }
      
      const fetchWishListsData = async () => {
        try {
            if (isAuthenticated) {
                const wishLists = await apiRequest('GET', `api/wishlists/${userId}`);
                setWishlists(wishLists); // Зберігаємо списки бажань
                console.log(wishLists);
            }
        } catch (error) {
            console.error('Error fetching wishlist data:', error);
            setErrorMessage('An error occurred while fetching wishlist data.');
        }
    };

      fetchRecomendationData();
      fetchWishListsData();
    }, [apiRequest, userId, isAuthenticated]); // Запускаємо ефект при зміні apiRequest або userId
    
    const handleViewDetails = (productId) => {
        navigate(`/Product/${productId}`);
    };
    
    // Функція для показу модального вікна та збереження вибраного продукту
    const handleAddToWishlist = (productId) => {
        setSelectedProductId(productId);
        setShowWishlistModal(true);
    };
    
    // Функція для додавання продукту до обраного списку бажань
    const handleSelectWishlist = async (wishlistId) => {
        try {
            await apiRequest('POST', `api/wishlists/${wishlistId}/${selectedProductId}`);
            alert('Product added to wishlist!');
        } catch (error) {
            console.error('Error adding product to wishlist:', error);
            alert('Failed to add product to wishlist.');
        }
        setShowWishlistModal(false); // Закриваємо модальне вікно після додавання
    };

    return (
        <div className="container-fluid mt-4">  {/* Заміна container на container-fluid */}
          <h3>Recommended Products</h3>
          <div 
            style={{
              overflowX: 'auto',
              display: 'flex',
              scrollBehavior: 'smooth' /* Додаємо плавну прокрутку */
            }}
          >
            <Row className="g-4 d-flex" style={{ flexWrap: 'nowrap', width: 'max-content' }}>
              {products.map((product) => (
                <Col md={4} key={product.id} style={{ flex: '0 0 auto' }}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{product.productName}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{product.description}</Card.Subtitle>
                      <Card.Text>
                        <strong>Price: </strong>{product.priceETH} ETH
                      </Card.Text>

                      <Button variant="primary" onClick={() => handleViewDetails(product.id)}>
                        Details
                      </Button>{' '}

                      {isAuthenticated == true ? 
                      <Button variant="secondary" onClick={() => handleAddToWishlist(product.id)}>
                        To wish list
                      </Button> :(<></>)
                    }
                      
                    </Card.Body>
                  </Card>
                </Col>
              ))}

              <WishlistModal
                show={showWishlistModal}
                onHide={() => setShowWishlistModal(false)}
                wishlists={wishlists}
                handleSelectWishlist={handleSelectWishlist}
            />
            </Row>
          </div>
        </div>
      );
  }