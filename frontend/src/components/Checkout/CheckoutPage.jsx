import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../ShoppingCart/Icons';
import AddressSection from './AddressSection';
import ProductList from './ProductList';
import ShippingMethod from './ShippingMethod';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import axios from 'axios';
import '../../assets/styles/components/Checkout/CheckoutPage.css';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { items: incomingItems = [] } = location.state || {};

    const [selectedAddress, setSelectedAddress] = useState({
        id: 1,
        name: "Nguyễn Văn A",
        phone: "0123456789",
        address: "123 Đường ABC, Phường XYZ",
        city: "Hà Nội",
        isDefault: true
    });

    const [orderItems, setOrderItems] = useState(() => {
        if (incomingItems.length > 0) {
            return incomingItems;
        }
        return [
            {
                id: 1,
                name: "Áo Thun Nam Cotton Premium",
                size: "L",
                color: "Đen",
                url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
                brand: "Coolmate",
                quantity: 2,
                priceAtAdd: 199000
            },
            {
                id: 2,
                name: "Quần Jeans Slim Fit",
                size: "32",
                color: "Xanh đậm",
                url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
                brand: "Levi's",
                quantity: 1,
                priceAtAdd: 899000
            }
        ];
    });

    const [selectedShipping, setSelectedShipping] = useState('standard');
    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [showConfirmation, setShowConfirmation] = useState(false); // State để hiển thị bảng xác nhận

    const shippingMethods = [
        {
            id: 'standard',
            name: 'Giao hàng tiết kiệm',
            time: '3-5 ngày',
            priceAtAdd: selectedAddress.priceShip * 0.8,
            description: 'Giao hàng trong giờ hành chính'
        },
        {
            id: 'express',
            name: 'Giao hàng nhanh',
            time: '1-2 ngày',
            priceAtAdd: selectedAddress.priceShip,
            description: 'Giao hàng ưu tiên, nhanh chóng'
        }
    ];

    const paymentMethods = [
        {
            id: 'cod',
            name: 'Thanh toán khi nhận hàng (COD)',
            description: 'Thanh toán bằng tiền mặt khi nhận hàng',
            icon: '💵'
        },
        {
            id: 'bank',
            name: 'Thẻ tín dụng/Ghi nợ',
            description: 'Visa, Mastercard',
            icon: '💳'
        },
        {
            id: 'paypal',
            name: 'Ví điện tử',
            description: 'MoMo, ZaloPay, VNPay',
            icon: '📱'
        }
    ];

    const handlePlaceOrder = () => {
        setShowConfirmation(true); // Hiển thị bảng xác nhận
    };

    const confirmOrder = async () => {
        setShowConfirmation(false); // Ẩn bảng xác nhận

        // Với COD (thanh toán khi nhận hàng)
        if (selectedPayment === 'cod') {
            try {
                const userId = JSON.parse(localStorage.getItem("user")).id;
                const name = JSON.parse(localStorage.getItem("user")).fullName;
                const addressId = selectedAddress.id;

                // Tạo đơn hàng
                const orderResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/create`, {
                    userId: userId,
                    addressId: addressId,
                    status: 'pending', // Đơn hàng được đánh dấu là đang chờ
                    createBy: name,
                    note: '',
                    items: orderItems.map(item => ({
                        id: item.id.toString(),
                        variantId: item.variantId.toString(),
                        quantity: item.quantity.toString()
                    }))
                });

                const orderId = orderResponse.data; // Lấy order_id từ phản hồi API
                console.log('Order created successfully:', orderResponse.data);

                // Tạo thanh toán
                const paymentResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment/create`, {
                    order: { id: orderId },
                    method: selectedPayment, // Phương thức thanh toán là COD
                    amount: total, // Tổng số tiền
                    status: 'pending', // Thanh toán đang chờ
                    captureId: null // Không có captureId cho COD
                });

                console.log('Payment created successfully:', paymentResponse.data);

                // Điều hướng về trang chủ hoặc trang xác nhận đơn hàng
                navigate('/');
                return;
            } catch (error) {
                console.error('Error creating order or payment:', error);
                alert('Đã xảy ra lỗi khi tạo đơn hàng hoặc thanh toán. Vui lòng thử lại.');
                return;
            }
        }

        // Với thanh toán online (thẻ tín dụng hoặc ví điện tử)
        navigate('/payment', { 
            state: { 
                amount: total,
                paymentMethod: selectedPayment,
                orderItems,
                shippingAddress: selectedAddress,
                shippingMethod: shippingMethods.find(m => m.id === selectedShipping)
            } 
        });
    };

    const cancelOrder = () => {
        setShowConfirmation(false); // Ẩn bảng xác nhận
    };

    const subtotal = useMemo(
        () => orderItems.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0),
        [orderItems]
    );
    const shippingFee = shippingMethods.find(m => m.id === selectedShipping)?.priceAtAdd || 0;
    const total = subtotal + shippingFee;

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem("user")).id;
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/addresses/user/${userId}`);
                const addressList = response.data || [];
                setSelectedAddress(addressList);

                const defaultAddress = addressList.find(addr => addr.isDefault) || addressList[0];
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress);
                }
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
    }, []);

    if (incomingItems.length === 0 && orderItems.length === 0) {
        return (
            <div className="checkout-page">
                <p>Không có sản phẩm để thanh toán.</p>
                <button onClick={() => navigate('/cart')}>Quay lại giỏ hàng</button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <div className="checkout-header">
                    <p>
                        <h1>Thanh toán đơn hàng</h1>
                        <p>Vui lòng kiểm tra thông tin trước khi đặt hàng</p>
                    </p>
                    <button onClick={() => navigate('/cart')} className="continue-shopping-btn">
                        <ArrowLeftIcon />
                        Quay lại giỏ hàng
                    </button>
                </div>

                <div className="checkout-grid">
                    <div className="checkout-left">
                        <AddressSection 
                            selectedAddress={selectedAddress}
                            onChangeAddress={() => navigate('/address')}
                        />

                        <ProductList items={orderItems} />

                        <ShippingMethod
                            methods={shippingMethods}
                            selected={selectedShipping}
                            onSelect={setSelectedShipping}
                        />

                        <PaymentMethod
                            methods={paymentMethods}
                            selected={selectedPayment}
                            onSelect={setSelectedPayment}
                        />
                    </div>

                    <div className="checkout-right">
                        <OrderSummary
                            subtotal={subtotal}
                            shippingFee={shippingFee}
                            total={total}
                            itemCount={orderItems.length}
                            onPlaceOrder={handlePlaceOrder}
                        />
                    </div>
                </div>
            </div>

            {/* Bảng xác nhận */}
            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="modal-content-checkout">
                        <h3>Xác nhận đặt hàng</h3>
                        <p>Bạn có chắc chắn muốn đặt hàng với tổng số tiền là {total.toLocaleString('vi-VN')} VND không?</p>
                        <div className="modal-actions-checkout">
                            <button onClick={confirmOrder} className="confirm-btn">Xác nhận</button>
                            <button onClick={cancelOrder} className="cancel-btn">Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;