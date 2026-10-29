import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./CustomerInfo.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTimes, faUser, faShoppingBag, faPhone, faEnvelope, 
  faMapMarkerAlt, faPlus, faCheckCircle, faTimesCircle,
  faSave, faBoxOpen, faSearch, faTimesCircle as faRemove
} from "@fortawesome/free-solid-svg-icons";

const CustomerInfo = ({ userId, userName, isInline = false }) => {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'orders'
  const [orderStats, setOrderStats] = useState({ completed: 0, cancelled: 0 });

  const [cartItems, setCartItems] = useState([]); // Lưu các sản phẩm trong giỏ hàng
  const [productVariants, setProductVariants] = useState([]); // Lưu các biến thể sản phẩm
  const [selectedVariant, setSelectedVariant] = useState(null); // Biến thể được chọn
  
  // Trạng thái cho tìm kiếm sản phẩm
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const searchTimeout = useRef(null);
  
  // Trạng thái cho form tạo đơn hàng mới
  const [newOrder, setNewOrder] = useState({
    productId: '',
    productName: '',
    quantity: 1,
    price: 0,
    size: '',
    color: '',
    note: '',
    imageUrl: ''
  });

  // Thêm vào phần đầu component, sau các state hiện có
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    city: '',
    district: '',
    detail: '',
    priceShip: 30000
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [lastAddedAddressId, setLastAddedAddressId] = useState(null); // Trạng thái lưu ID địa chỉ vừa thêm

  // Thêm vào đầu component CustomerInfo, sau các state đã có
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        // Fetch customer info
        const customerResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/addresses/user/${userId.replace(/\D/g, '')}`);
        if (customerResponse.data.length === 0) {
          setCustomer({
            fullName: userName || 'Khách hàng mới',
            phone: '',
            city: '',
            district: '',
            detail: '',
            priceShip: 30000
          });
        } else {
          setCustomer(customerResponse.data[0]);
        }

        // Fetch customer orders
        const ordersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/user/${userId.replace(/\D/g, '')}`);
        setOrders(ordersResponse.data.reverse());
        
        // Tính toán số đơn hoàn thành và hủy
        const completedOrders = ordersResponse.data.filter(
          order => order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed'
        ).length;
        
        const cancelledOrders = ordersResponse.data.filter(
          order => order.status?.toLowerCase() === 'cancelled' || order.status?.toLowerCase() === 'returned'
        ).length;
        
        setOrderStats({
          completed: completedOrders,
          cancelled: cancelledOrders
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setError("Không thể tải thông tin khách hàng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchCustomerData();
    }
  }, [userId]);

  // Xử lý tìm kiếm sản phẩm
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (searchTerm.trim().length >= 2) {
      setSearching(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/info`);
          // Lọc các sản phẩm có slug chứa từ khóa tìm kiếm
          const filteredResults = response.data.filter(product => 
            product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 5); // Giới hạn 5 kết quả
          
          setSearchResults(filteredResults);
          setSearching(false);
        } catch (error) {
          console.error("Error searching products:", error);
          setSearchResults([]);
          setSearching(false);
        }
      }, 500);
    } else {
      setSearchResults([]);
      setSearching(false);
    }
    
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchTerm]);

  // Cập nhật phương thức handleSelectProduct
  const handleSelectProduct = async (slug, priceNow = 0) => {
    try {
      setSearching(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/slug/${slug}`);
      const product = response.data;
      
      setSelectedProduct(product);
      setSearchTerm(''); // Xóa từ khóa tìm kiếm
      setSearchResults([]); // Xóa kết quả tìm kiếm
      
      // Lấy danh sách biến thể sản phẩm từ API inventory
      const inventoryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/inventory`);
      const variants = inventoryResponse.data.filter(v => v.productId === product.id);
      const list = variants.map(variant => {
        variant.price = priceNow > 0 ? priceNow : product.price;
        return variant;
      });
      setProductVariants(list);

      setSearching(false);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setSearching(false);
    }
  };

  // Xóa sản phẩm đã chọn
  const handleClearProduct = () => {
    setSelectedProduct(null);
    setAvailableSizes([]);
    setAvailableColors([]);
    setNewOrder({
      ...newOrder,
      productId: '',
      productName: '',
      price: 0,
      size: '',
      color: '',
      imageUrl: ''
    });
  };

  // Thêm phương thức chọn biến thể sản phẩm
  const handleSelectVariant = (variant) => {
    setSelectedVariant(variant);
  };

  // Thêm phương thức thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cartItems.findIndex(item => item.variantId === selectedVariant.variantId);
    
    if (existingItemIndex !== -1) {
      // Nếu đã có, cập nhật số lượng
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // Nếu chưa có, thêm mới
      setCartItems([
        ...cartItems,
        {
          variantId: selectedVariant.variantId,
          productName: selectedVariant.name,
          size: selectedVariant.size.split(',')[0].trim(),
          color: selectedVariant.color.split(',')[0].trim(),
          price: selectedVariant.price,
          imageUrl: selectedVariant.imageUrl,
          quantity: 1
        }
      ]);
    }
    
    // Reset biến thể đã chọn
    setSelectedVariant(null);
  };

  // Thêm phương thức xóa sản phẩm khỏi giỏ hàng
  const handleRemoveFromCart = (variantId) => {
    setCartItems(cartItems.filter(item => item.variantId !== variantId));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#FFC107'; // vàng
      case 'processing': return '#3498DB'; // xanh dương
      case 'shipped': return '#2ECC71'; // xanh lá
      case 'delivered': return '#27AE60'; // xanh lá đậm
      case 'paid': return '#27AE60'; // xanh lá đậm
      case 'cancelled': return '#E74C3C'; // đỏ
      default: return '#95A5A6'; // xám
    }
  };

  // Thêm hàm helper để chuyển status sang tiếng Việt
  const getVietnameseStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang vận chuyển';
      case 'delivered': return 'Đã giao';
      case 'paid': return 'Đã thanh toán';
      case 'cancelled': return 'Đã hủy';
      default: return 'Chưa xác định';
    }
  };

  // Thêm hàm kiểm tra đơn hàng mới (trong 24h)
  const isNewOrder = (dateString) => {
    if (!dateString) return false;
    const orderDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - orderDate);
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const handleNewOrderChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({
      ...newOrder,
      [name]: value
    });
  };

  // Cập nhật phương thức handleCreateOrder
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      if (cartItems.length === 0) {
        showToast('Vui lòng thêm ít nhất một sản phẩm vào đơn hàng', 'warning');
        return;
      }

      if (!customer || !customer.id) {
        showToast('Vui lòng chọn hoặc thêm địa chỉ giao hàng', 'warning');
        return;
      }

      const salerName = JSON.parse(localStorage.getItem('user')).fullName;
      
      // Tạo payload cho API sử dụng địa chỉ đã chọn
      const payload = {
        userId: userId.replace(/\D/g, ''),
        addressId: customer.id, // Sử dụng id của địa chỉ đã chọn
        status: "pending",
        createBy: salerName,
        note: newOrder.note || "",
        items: cartItems.map(item => ({
          id: -1,
          variantId: item.variantId.toString(),
          quantity: item.quantity.toString()
        }))
      };

      // Gọi API tạo đơn hàng
      await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/create`, payload);
      
      // Reset form và giỏ hàng
      setCartItems([]);
      setNewOrder({
        productId: '',
        productName: '',
        quantity: 1,
        price: 0,
        size: '',
        color: '',
        note: '',
        imageUrl: ''
      });
      setSelectedProduct(null);
      setSelectedVariant(null);
      setProductVariants([]);
      
      // Tải lại danh sách đơn hàng
      const ordersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/user/${userId.replace(/\D/g, '')}`);
      setOrders(ordersResponse.data.reverse());
      
      // Cập nhật thống kê
      const completedOrders = ordersResponse.data.filter(
        order => order.status?.toLowerCase() === 'delivered'
      ).length;
      
      const cancelledOrders = ordersResponse.data.filter(
        order => order.status?.toLowerCase() === 'cancelled'
      ).length;
      
      setOrderStats({
        completed: completedOrders,
        cancelled: cancelledOrders
      });
      
      // Chuyển tab sang đơn hàng
      setActiveTab('orders');
      
      showToast('Đơn hàng đã được tạo thành công!', 'success');
    } catch (err) {
      console.error("Error creating order:", err);
      showToast('Không thể tạo đơn hàng. Vui lòng thử lại sau.', 'error');
    }
  };

  // Thêm vào useEffect để lấy danh sách địa chỉ
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/addresses/user/${userId.replace(/\D/g, '')}`);
        setAddresses(response.data);
        // Set customer là địa chỉ đầu tiên (mặc định)
        if (response.data.length > 0) {
          setCustomer(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  // Hàm xử lý thay đổi form địa chỉ
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm hiển thị form thêm địa chỉ
  const handleShowAddressForm = () => {
    setShowAddressForm(true);
    // Điền thông tin từ customer hiện tại vào form nếu có
    if (customer) {
      setNewAddress({
        fullName: customer.fullName || '',
        phone: customer.phone || '',
        city: customer.city || '',
        district: customer.district || '',
        detail: customer.detail || '',
        priceShip: customer.priceShip || 30000
      });
    } else {
      setNewAddress({
        fullName: '',
        phone: '',
        city: '',
        district: '',
        detail: '',
        priceShip: 30000
      });
    }
  };

  // Hàm đóng form thêm địa chỉ
  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    
    if (!newAddress.fullName || !newAddress.phone || !newAddress.detail) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
      return;
    }
    
    try {
      setIsAddingAddress(true);
      
      const payload = {
        user: {
          id: userId.replace(/\D/g, '')
        },
        fullName: newAddress.fullName,
        phone: newAddress.phone,
        city: newAddress.city,
        district: newAddress.district,
        detail: newAddress.detail,
        priceShip: newAddress.priceShip
      };
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/addresses/create`, payload);

      const updatedAddresses = await axios.get(`${process.env.REACT_APP_API_URL}/api/addresses/user/${userId.replace(/\D/g, '')}`);
      setAddresses(updatedAddresses.data);
      
      setCustomer(response.data);
      setLastAddedAddressId(response.data.id); // Lưu ID địa chỉ vừa thêm
      
      // Đóng form và hiển thị thông báo
      setShowAddressForm(false);
      setIsAddingAddress(false);

      showToast('Địa chỉ mới đã được cập nhật thành công!', 'success');
      
      // Sau 3 giây, đặt lại lastAddedAddressId thành null
      setTimeout(() => {
        setLastAddedAddressId(null);
      }, 3000);
    } catch (error) {
      console.error("Error adding address:", error);
      setIsAddingAddress(false);
      showToast('Không thể cập nhật địa chỉ mới. Vui lòng thử lại sau.', 'error');
    }
  };

  // Hàm chọn địa chỉ
  const handleSelectAddress = (address) => {
    setCustomer(address);
  };

  // Hàm hiển thị toast
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Tự động ẩn toast sau 3 giây
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  // Component Toast hiển thị từng thông báo
  const Toast = ({ id, message, type }) => {
    const handleClose = () => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    
    return (
      <div className={`${styles.toast} ${styles[type]}`}>
        <div className={styles.toastIcon}>
          {type === 'success' && '✓'}
          {type === 'error' && '✗'}
          {type === 'info' && 'ℹ'}
          {type === 'warning' && '⚠'}
        </div>
        <div className={styles.toastMessage}>{message}</div>
        <button className={styles.toastClose} onClick={handleClose}>×</button>
      </div>
    );
  };

  const containerClass = isInline ? styles.inlineContainer : styles.modalContainer;

  if (loading) {
    return (
      <div className={containerClass}>
        <div className={styles.header}>
          <h3>Đang tải thông tin...</h3>
        </div>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClass}>
        <div className={styles.header}>
          <h3>Lỗi</h3>
        </div>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {/* Hiển thị các toast thông báo */}
      <div className={styles.toastsContainer}>
        {toasts.map(toast => (
          <Toast key={toast.id} id={toast.id} message={toast.message} type={toast.type} />
        ))}
      </div>
      <div className={styles.header}>
        <h3>
          <FontAwesomeIcon icon={faUser} className={styles.headerIcon} />
          Khách hàng: {userName}
        </h3>
      </div>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Thông tin
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'orders' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Đơn hàng ({orders.length})
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'newOrder' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('newOrder')}
          style={addresses.length === 0 ? { pointerEvents: 'none', cursor: 'not-allowed', opacity: 0.5 } : {}}
        >
          <FontAwesomeIcon icon={faPlus} /> Tạo đơn
        </button>
      </div>

      <div className={styles.contentWrapper}>
        {activeTab === 'info' && customer && (
          <div className={styles.customerDetails}>
            {/* Phần hiển thị thông tin khách hàng hiện có */}
            <div className={styles.infoRow}>
              <FontAwesomeIcon icon={faUser} className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Họ và tên:</span>
                <span className={styles.infoValue}>{customer.fullName || userName}</span>
              </div>
            </div>
            
            <div className={styles.infoRow}>
              <FontAwesomeIcon icon={faEnvelope} className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{customer.email || 'Chưa cập nhật'}</span>
              </div>
            </div>
            
            <div className={styles.infoRow}>
              <FontAwesomeIcon icon={faPhone} className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Số điện thoại:</span>
                <span className={styles.infoValue}>{customer.phone || 'Chưa cập nhật'}</span>
              </div>
            </div>
            
            <div className={styles.infoRow}>
              <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Địa chỉ:</span>
                <span className={styles.infoValue}>{customer.detail || 'Chưa cập nhật'}</span>
              </div>
            </div>
            
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>🛍️</div>
              <div>
                <span className={styles.infoLabel}>Tổng đơn hàng:</span>
                <span className={styles.infoValue}>{orders.length}</span>
              </div>
            </div>
            
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>💰</div>
              <div>
                <span className={styles.infoLabel}>Tổng chi tiêu:</span>
                <span className={styles.infoValue}>
                  {formatCurrency(orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0))}
                </span>
              </div>
            </div>
            
            {/* Phần địa chỉ */}
            <div className={styles.addressSection}>
              <h4 className={styles.addressSectionTitle}>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Địa chỉ giao hàng
                <button 
                  type="button" 
                  className={styles.addAddressBtn}
                  onClick={handleShowAddressForm}
                >
                  <FontAwesomeIcon icon={faPlus} /> Thay đổi địa chỉ
                </button>
              </h4>
              
              {addresses.length > 0 ? (
                <div className={styles.addressesList}>
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`${styles.addressItem} 
                        ${address.id === customer.id ? styles.selectedAddress : ''} 
                        ${address.id === lastAddedAddressId ? styles.newlyAddedAddress : ''}`}
                      onClick={() => handleSelectAddress(address)}
                    >
                      <div className={styles.addressHeader}>
                        <div className={styles.addressName}>{address.fullName}</div>
                        <div className={styles.addressPhone}>{address.phone}</div>
                        {address.id === customer.id && (
                          <div className={styles.defaultBadge}>Mặc định</div>
                        )}
                      </div>
                      <div className={styles.addressDetail}>
                        {address.detail}
                      </div>
                      <div className={styles.addressLocation}>
                        {address.district}, {address.city}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noAddresses}>
                  Khách hàng chưa có địa chỉ nào
                </div>
              )}
            </div>
            
            {/* Form thêm địa chỉ mới */}
            {showAddressForm && (
              <div className={styles.addressFormOverlay}>
                <div className={styles.addressForm}>
                  <div className={styles.addressFormHeader}>
                    <h4>Thêm địa chỉ mới</h4>
                    <button 
                      type="button" 
                      className={styles.closeFormBtn}
                      onClick={handleCloseAddressForm}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSaveAddress}>
                    <div className={styles.formGroup}>
                      <label htmlFor="fullName">Họ và tên <span className={styles.required}>*</span></label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={newAddress.fullName}
                        onChange={handleAddressChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Số điện thoại <span className={styles.required}>*</span></label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressChange}
                        className={styles.formInput}
                        required
                      />
                    </div>
                    
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="city">Thành phố/Tỉnh</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          className={styles.formInput}
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="district">Quận/Huyện</label>
                        <input
                          type="text"
                          id="district"
                          name="district"
                          value={newAddress.district}
                          onChange={handleAddressChange}
                          className={styles.formInput}
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="detail">Địa chỉ chi tiết <span className={styles.required}>*</span></label>
                      <textarea
                        id="detail"
                        name="detail"
                        value={newAddress.detail}
                        onChange={handleAddressChange}
                        className={styles.formTextarea}
                        rows="3"
                        required
                      ></textarea>
                    </div>
                    
                    <div className={styles.formActions}>
                      <button 
                        type="button" 
                        className={styles.cancelBtn}
                        onClick={handleCloseAddressForm}
                      >
                        Hủy bỏ
                      </button>
                      <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={isAddingAddress}
                      >
                        {isAddingAddress ? (
                          <>
                            <div className={styles.buttonSpinner}></div>
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faSave} /> Lưu địa chỉ
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.ordersList}>
            {orders.length === 0 ? (
              <div className={styles.emptyState}>
                <FontAwesomeIcon icon={faShoppingBag} className={styles.emptyIcon} />
                <p>Khách hàng chưa có đơn hàng nào</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className={styles.orderItem}>
                  <div 
                    className={styles.orderHeader} 
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    <div className={styles.orderCreator}>
                      {order.createBy || 'Hệ thống'}
                    </div>
                    
                    {isNewOrder(order.createdAt) && (
                      <div className={styles.newOrderBadge}>Mới</div>
                    )}
                  </div>
                  
                  <div className={styles.orderContent}>
                    <div className={styles.orderMeta}>
                      <div className={styles.orderNumber}>
                        #{order.orderNumber || order.id}
                        <span className={styles.orderDate}>
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className={styles.orderStatusBadge}>
                        {getVietnameseStatus(order.status)}
                      </div>
                    </div>
                    
                    <div className={styles.orderSummary}>
                      <div className={styles.orderDetail}>
                        <span className={styles.orderDetailLabel}>Khách hàng:</span>
                        <span>{order.address?.fullName || order.user?.fullName || 'Không có tên'}</span>
                      </div>
                      
                      <div className={styles.orderDetail}>
                        <span className={styles.orderDetailLabel}>Số điện thoại:</span>
                        <span>{order.address?.phone || order.user?.phone || 'N/A'}</span>
                      </div>
                      
                      <div className={styles.orderDetail}>
                        <span className={styles.orderDetailLabel}>Địa chỉ:</span>
                        <span>{order.address.district + ', ' + order.address.city || 'Không có'}</span>
                      </div>
                      
                      <div className={styles.orderDetail}>
                        <span className={styles.orderDetailLabel}>Tổng tiền:</span>
                        <span className={styles.orderAmount}>{formatCurrency(order.totalAmount)}</span>
                      </div>
                      
                      {order.note && (
                        <div className={styles.orderNote}>
                          <span className={styles.orderNoteLabel}>Ghi chú:</span>
                          <span>{order.note}</span>
                        </div>
                      )}
                    </div>
                    
                    {order.items && order.items.length > 0 && (
                      <div className={styles.orderProducts}>
                        <div className={styles.orderProductsHeader}>Sản phẩm đặt mua</div>
                        {order.items.map((item, index) => (
                          <div key={index} className={styles.orderProduct}>
                            <div className={styles.productImage}>
                              {item.imageUrl ? (
                                <img src={item.imageUrl ? `${item.imageUrl.replace("http://localhost:8080", process.env.REACT_APP_API_URL)}` : 'none'} alt={item.productName} />
                              ) : (
                                <div className={styles.noImage}>Không có hình</div>
                              )}
                            </div>
                            <div className={styles.productInfo}>
                              <div className={styles.productName}>{item.productName}</div>
                              <div className={styles.productVariant}>
                                {item.size && <span>Size: {item.size}</span>}
                                {item.color && <span>Màu: {item.color}</span>}
                              </div>
                              <div className={styles.productMeta}>
                                <span className={styles.productQuantity}>SL: {item.quantity}</span>
                                <span className={styles.productPrice}>{formatCurrency(item.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'newOrder' && (
          <div className={styles.createOrderForm}>
            <h4 className={styles.formTitle}>
              <FontAwesomeIcon icon={faPlus} /> Tạo đơn hàng mới
            </h4>
            
            <form onSubmit={handleCreateOrder}>
              {/* Khu vực tìm kiếm sản phẩm */}
              <div className={styles.formGroup}>
                <label>Tìm kiếm sản phẩm:</label>
                <div className={styles.searchContainer}>
                  <div className={styles.searchInputWrapper}>
                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                        }
                      }}
                      className={styles.searchInput}
                      placeholder="Tìm sản phẩm theo tên hoặc mã"
                    />
                    {searching && <div className={styles.searchingSpinner}></div>}
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className={styles.searchResults}>
                      {searchResults.map(product => (
                        <div 
                          key={product.id}
                          className={styles.searchResultItem}
                          onClick={() => handleSelectProduct(product.slug, product.priceNow)}
                        >
                          <div className={styles.resultImage}>
                            <img src={product.url ? `${product.url.replace("http://localhost:8080", process.env.REACT_APP_API_URL)}` : 'none'} alt={product.name} />
                          </div>
                          <div className={styles.resultInfo}>
                            <div className={styles.resultName}>{product.name}</div>
                            <div className={styles.resultMeta}>
                              {formatCurrency(product.priceNow || product.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Hiển thị sản phẩm đã chọn */}
              {selectedProduct && (
                <div className={styles.selectedProduct}>
                  <div className={styles.selectedProductHeader}>
                    <h5>Sản phẩm: {selectedProduct.name}</h5>
                    <button 
                      type="button" 
                      className={styles.clearButton}
                      onClick={handleClearProduct}
                    >
                      <FontAwesomeIcon icon={faRemove} /> Xóa
                    </button>
                  </div>
                  
                  {/* Danh sách biến thể */}
                  <div className={styles.variantsList}>
                    {productVariants.map(variant => (
                      <div 
                        key={variant.variantId}
                        className={`${styles.variantItem} ${selectedVariant?.variantId === variant.variantId ? styles.selectedVariant : ''}`}
                        onClick={() => handleSelectVariant(variant)}
                      >
                        <div className={styles.variantImage}>
                          <img src={variant.imageUrl ? `${variant.imageUrl.replace("http://localhost:8080", process.env.REACT_APP_API_URL)}` : 'none'} alt={variant.name} />
                        </div>
                        <div className={styles.variantInfo}>
                          <div className={styles.variantName}>{variant.name}</div>
                          <div className={styles.variantDetails}>
                            <span>Size: {variant.size.split(',')[0]}</span>
                            <span>Màu: {variant.color.split(',')[0]}</span>
                          </div>
                          <div className={styles.variantPrice}>
                            {formatCurrency(variant.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Nút thêm vào giỏ hàng */}
                  {selectedVariant && (
                    <button 
                      type="button"
                      className={styles.addToCartBtn}
                      onClick={handleAddToCart}
                    >
                      + Thêm vào đơn hàng
                    </button>
                  )}
                </div>
              )}
              
              {/* Hiển thị giỏ hàng */}
              <div className={styles.cartContainer}>
                <h5 className={styles.cartTitle}>Đơn hàng ({cartItems.length})</h5>
                
                {cartItems.length === 0 ? (
                  <div className={styles.emptyCart}>
                    <FontAwesomeIcon icon={faShoppingBag} className={styles.emptyIcon} />
                    <p>Chưa có sản phẩm nào trong đơn hàng</p>
                  </div>
                ) : (
                  <>
                    <div className={styles.cartItems}>
                      {cartItems.map(item => (
                        <div key={item.variantId} className={styles.cartItem}>
                          <div className={styles.cartItemImage}>
                            <img src={item.imageUrl ? `${item.imageUrl.replace("http://localhost:8080", process.env.REACT_APP_API_URL)}` : 'none'} alt={item.productName} />
                          </div>
                          <div className={styles.cartItemInfo}>
                            <div className={styles.cartItemName}>{item.productName}</div>
                            <div className={styles.cartItemVariant}>
                              Size: {item.size} | Màu: {item.color}
                            </div>
                            <div className={styles.cartItemPrice}>
                              {formatCurrency(item.price)} x {item.quantity} = {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                          <button 
                            type="button"
                            className={styles.removeItemBtn}
                            onClick={() => handleRemoveFromCart(item.variantId)}
                          >
                            <FontAwesomeIcon icon={faRemove} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className={styles.cartTotal}>
                      <span>Tổng tiền:</span>
                      <span className={styles.cartTotalAmount}>
                        {formatCurrency(cartItems.reduce((total, item) => total + (item.price * item.quantity), 0))}
                      </span>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Ghi chú đơn hàng:</label>
                      <textarea
                        name="note"
                        value={newOrder.note}
                        onChange={handleNewOrderChange}
                        className={styles.formTextarea}
                        placeholder="Ghi chú đơn hàng"
                        rows="3"
                      ></textarea>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Địa chỉ giao hàng:</label>
                      <div className={styles.addressDisplay}>
                        <p><strong>{customer?.fullName}</strong> | {customer?.phone}</p>
                        <p>{customer?.detail}</p>
                        <p>{customer?.district}, {customer?.city}</p>
                      </div>
                    </div>
                    
                    <div className={styles.formActions}>
                      <button 
                        type="submit" 
                        className={styles.submitButton}
                      >
                        <FontAwesomeIcon icon={faSave} /> Tạo đơn hàng
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Thanh thống kê nổi ở dưới cùng */}
      <div className={styles.orderStatsBar}>
        <div className={styles.statsItem}>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.statsIconSuccess} />
          <span>{orderStats.completed}</span>
        </div>
        <div className={styles.statsItem}>
          <FontAwesomeIcon icon={faTimesCircle} className={styles.statsIconCancelled} />
          <span>{orderStats.cancelled}</span>
        </div>
        <div className={styles.statsItem}>
          <FontAwesomeIcon icon={faBoxOpen} className={styles.statsIconTotal} />
          <span>{orders.length}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;