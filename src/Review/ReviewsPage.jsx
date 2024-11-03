import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../Contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function ReviewsPage() {
    const { role, userId, apiRequest } = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    async function fetchReviewsData() {
        let response;
        if (role === "User") {
            response = await apiRequest('GET', `api/reviews`, {
                userId: userId
            });
        } else if (role === "Seller") {
            response = await apiRequest('GET', `api/reviews`, {
                sellerId: userId
            });
        }

        setReviews(response || []); // Ensure it's an array
    }

    useEffect(() => {
        if (userId) {
            fetchReviewsData();
        }
    }, [userId]);

    const renderStars = (rating) => {
        return (
            <>
                {[...Array(5)].map((star, index) => {
                    return (
                        <span key={index} className={index < rating ? "text-warning" : "text-secondary"}>
                            ★
                        </span>
                    );
                })}
            </>
        );
    };

    const handleViewDetails = (productId) => {
        navigate(`/Product/${productId}`); // Programmatic navigation
    };

    return (
        <div className="container mt-5" style={{ minHeight: '100vh' }}>
            <h2>User Reviews</h2>
            <div className="row">
                {reviews.map(review => (
                    <div className="col-md-4 mb-4" key={review.reviewId}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    <button 
                                        onClick={() => handleViewDetails(review.productId)} 
                                        className="btn btn-link text-decoration-none">
                                        Product {review.productId}
                                    </button>
                                </h5>
                                <div className="card-text">
                                    <div className="mb-2">
                                        {renderStars(review.rating)}
                                    </div>
                                    <p>{review.comment}</p>
                                    <small className="text-muted">
                                        {new Date(review.reviewDate).toLocaleDateString()} 
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}