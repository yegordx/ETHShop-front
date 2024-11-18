import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthProvider';
import { Container, Form } from 'react-bootstrap'; // Імпортуємо компоненти Bootstrap
import CountriesComponent from './CountriesComponent';
import SalesGraphComponent from './SalesGraphComponent';

export default function SellersAnalytic() {
    const { apiRequest, userId } = useContext(AuthContext); // Отримуємо контекст для API та ID користувача
    const [analytic, setAnalytic] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null); // Стан для вибраного продукту
  
    useEffect(() => {
      async function fetchAnalyticData() {
        try {
          const response = await apiRequest('GET', `api/sellers/${userId}/analytics`);
          setAnalytic(response);
          if (response && response.productAnalytics && response.productAnalytics.length > 0) {
            // Встановлюємо перший товар за замовчуванням
            setSelectedProduct(response.productAnalytics[0]);
          }
          console.log(response); 
        } catch (error) {
          console.error('Failed to fetch recommendation data:', error);
        }
      }
      fetchAnalyticData();
    }, [apiRequest, userId]);
  
    // Обробник зміни вибраного товару
    const handleProductChange = (event) => {
      const selectedProduct = analytic.productAnalytics.find(
        (product) => product.product.productID === event.target.value
      );
      setSelectedProduct(selectedProduct);
    };
  
    return (
        <Container> {/* Контейнер з відступами */}
          {analytic ? (
            <>
              {/* Відображаємо аналіз попиту за країнами */}
              <div className="d-flex justify-content-center mb-4">
                <CountriesComponent demandByCountry={analytic.demandByCountry} />
              </div>    
              <p><strong>Total Sales:</strong> {analytic.totalSales}</p>              {/* Випадаючий список для вибору товару */}
              <Form.Group controlId="productSelect">
                <Form.Label>Select Product</Form.Label>
                <Form.Control 
                  as="select" 
                  value={selectedProduct?.product.productID} 
                  onChange={handleProductChange}
                  className="mb-3" // Відступ під випадаючим списком
                >
                  {analytic.productAnalytics.map((product) => (
                    <option key={product.product.productID} value={product.product.productID}>
                      {product.product.productName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
    
              {/* Відображаємо графік продажів для вибраного товару */}
              {selectedProduct && <SalesGraphComponent productData={selectedProduct} />}
            </>
          ) : (
            <p>Loading analytics...</p>
          )}
        </Container>
      );
  }