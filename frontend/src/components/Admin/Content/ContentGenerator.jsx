import React, { useState, useEffect } from 'react';
import Toast from '../../Toast/Toast';
import { Copy, Sparkles, RefreshCw, Package, Tag, User, MessageSquare, Gift, Calendar, TrendingUp, Send } from 'lucide-react';

// Updated styles object
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff9fa 0%, #ffeff4 100%)',
    padding: '2rem 1rem',
    position: 'relative',
    overflow: 'hidden',
    zIndex: '1'
  },
  wrapper: {
    maxWidth: '1600px',
    margin: '0 auto',
    position: 'relative',
    zIndex: '2'
  },
  header: {
    textAlign: 'center',
    color: '#7a2963',
    marginBottom: '3rem',
    animation: 'fadeIn 0.8s ease-in'
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    textShadow: '0 2px 10px rgba(222, 50, 111, 0.15)',
    color: '#de326f'
  },
  subtitle: {
    fontSize: '1.2rem',
    opacity: 0.85,
    fontWeight: '400',
    letterSpacing: '0.5px',
    color: '#7a2963'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  },
  card: {
    background: '#ffffff',
    borderRadius: '1.25rem',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(222, 50, 111, 0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid rgba(222, 50, 111, 0.1)'
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1.75rem',
    color: '#de326f',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid #ffccd9'
  },
  formGroup: {
    marginBottom: '1.75rem'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#7a2963',
    fontSize: '0.95rem'
  },
  input: {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '1.5px solid #ffd5df',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#fff',
    fontFamily: 'inherit',
    color: '#444'
  },
  inputFocus: {
    border: '1.5px solid #de326f',
    backgroundColor: '#fff',
    boxShadow: '0 0 0 3px rgba(222, 50, 111, 0.1)'
  },
  textarea: {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '1.5px solid #ffd5df',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    minHeight: '120px',
    resize: 'vertical',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#fff',
    fontFamily: 'inherit',
    lineHeight: '1.6',
    color: '#444'
  },
  select: {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '1.5px solid #ffd5df',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    cursor: 'pointer',
    backgroundColor: '#fff',
    fontFamily: 'inherit',
    color: '#444',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23de326f\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
    backgroundSize: '1rem'
  },
  multiSelectWrapper: {
    position: 'relative'
  },
  multiSelect: {
    width: '100%',
    padding: '0.85rem 1rem',
    border: '1.5px solid #ffd5df',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    minHeight: '140px',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: '#fff',
    fontFamily: 'inherit',
    cursor: 'pointer',
    color: '#444'
  },
  selectOption: {
    padding: '0.5rem',
    cursor: 'pointer'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '1.5rem'
  },
  button: {
    flex: 1,
    padding: '1rem 1.75rem',
    background: 'linear-gradient(135deg, #de326f 0%, #ff8fb2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(222, 50, 111, 0.25)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 25px rgba(222, 50, 111, 0.35)'
  },
  resetButton: {
    background: 'linear-gradient(135deg, #7a2963 0%, #de326f 100%)',
    boxShadow: '0 8px 20px rgba(122, 41, 99, 0.25)'
  },
  outputCard: {
    background: '#ffffff',
    borderRadius: '1.25rem',
    padding: '2rem',
    boxShadow: '0 10px 30px rgba(222, 50, 111, 0.08)',
    backdropFilter: 'blur(10px)',
    gridColumn: '1 / -1',
    border: '1px solid rgba(222, 50, 111, 0.1)'
  },
  outputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  outputContent: {
    background: '#fafafa',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1.5px solid #f0f0f0',
    minHeight: '250px',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontSize: '0.95rem',
    lineHeight: '1.8',
    color: '#444',
    fontFamily: 'monospace',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)'
  },
  loadingText: {
    color: '#999',
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  errorText: {
    color: '#e53e3e',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#fff0f0',
    borderRadius: '0.5rem',
    border: '1px solid #ffcccc'
  },
  selectedItems: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginTop: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#fff9fa',
    borderRadius: '0.5rem',
    border: '1.5px dashed #ffd5df',
    minHeight: '60px'
  },
  tag: {
    background: 'linear-gradient(135deg, #de326f 0%, #ff8fb2 100%)',
    color: 'white',
    padding: '0.4rem 0.8rem',
    borderRadius: '1rem',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 8px rgba(222, 50, 111, 0.2)',
    transition: 'all 0.3s ease',
    fontWeight: '500'
  },
  tagHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(222, 50, 111, 0.3)'
  },
  removeTag: {
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    transition: 'all 0.2s ease'
  },
  removeTagHover: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: 'rotate(90deg)'
  },
  emptyState: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '0.75rem',
    fontSize: '0.9rem'
  },
  copyButton: {
    padding: '0.6rem 1.25rem',
    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.25)'
  },
  icon: {
    minWidth: '18px',
    minHeight: '18px'
  },
  sectionDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #ffd5df, transparent)',
    margin: '1.5rem 0',
    borderRadius: '1px'
  },
  bubble: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(255, 143, 178, 0.4) 0%, rgba(255, 213, 223, 0.2) 100%)',
    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.3), 0 10px 30px rgba(222, 50, 111, 0.1)',
    animation: 'float 8s ease-in-out infinite',
    zIndex: '0',
    backdropFilter: 'blur(5px)',
  }
};

const ContentGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    products: [],
    categories: [],
    style: '',
    targetAudience: '',
    tone: '',
    promotion: '',
    timing: ''
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [error, setError] = useState({ products: '', categories: '', api: '' });
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredTag, setHoveredTag] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type }]);
      
      setTimeout(() => {
        removeToast(id);
      }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  
  // Generate random bubbles
  const bubbles = Array.from({ length: 12 }).map((_, index) => {
    const size = 60 + Math.random() * 140;
    return {
      ...styles.bubble,
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: 0.1 + Math.random() * 0.2,
      animationDelay: `${index * 0.7}s`
    };
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/inventory`);
      if (!response.ok) throw new Error('Không thể tải sản phẩm');
      const data = await response.json();
      setProducts(data);
      setError(prev => ({ ...prev, products: '' }));
    } catch (err) {
      setError(prev => ({ ...prev, products: err.message }));
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categorys/`);
      if (!response.ok) throw new Error('Không thể tải danh mục');
      const data = await response.json();
      setCategories(data);
      setError(prev => ({ ...prev, categories: '' }));
    } catch (err) {
      setError(prev => ({ ...prev, categories: err.message }));
      console.error('Error fetching categories:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field, value) => {
    const selected = Array.from(value.selectedOptions).map(opt => opt.value);
    setFormData(prev => ({ ...prev, [field]: selected }));
  };

  const removeSelectedItem = (field, itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== itemToRemove)
    }));
  };

  const generateContent = () => {
    setLoading(true);
    
    setTimeout(() => {
      let prompt = '╔═══════════════════════════════════════════════════════════╗\n';
      prompt += '║          PROMPT TẠO NỘI DUNG MARKETING                    ║\n';
      prompt += '╚═══════════════════════════════════════════════════════════╝\n\n';
      
      if (formData.title) {
        prompt += '📌 TIÊU ĐỀ CHIẾN DỊCH\n';
        prompt += `${formData.title}\n\n`;
      }
      
      if (formData.description) {
        prompt += '📝 MÔ TẢ CHI TIẾT\n';
        prompt += `${formData.description}\n\n`;
      }
      
      if (formData.products.length > 0) {
        prompt += '🛍️ SẢN PHẨM ĐƯỢC CHỌN\n';
        prompt += '─────────────────────────────────────────────────────────\n';
        formData.products.forEach((productId, index) => {
          const product = products.find(p => p.variantId === parseInt(productId));
          if (product) {
            prompt += `\n${index + 1}. ${product.name}\n`;
            prompt += `   • Thương hiệu: ${product.brand}\n`;
            prompt += `   • SKU: ${product.sku}\n`;
            prompt += `   • Kích thước: ${product.size} | Màu sắc: ${product.color.split(',')[0]}\n`;
            prompt += `   • Giá bán: ${product.price.toLocaleString('vi-VN')}đ\n`;
            prompt += `   • Danh mục: ${product.category}\n`;
            prompt += `   • Tồn kho: ${product.stock} sản phẩm\n`;
          }
        });
        prompt += '\n';
      }
      
      if (formData.categories.length > 0) {
        prompt += '📁 DANH MỤC SẢN PHẨM\n';
        prompt += '─────────────────────────────────────────────────────────\n';
        formData.categories.forEach((categoryId, index) => {
          const category = categories.find(c => c.id === parseInt(categoryId));
          if (category) {
            prompt += `${index + 1}. ${category.name}\n`;
          }
        });
        prompt += '\n';
      }
      
      if (formData.style) {
        prompt += '🎨 PHONG CÁCH\n';
        prompt += `${formData.style}\n\n`;
      }
      
      if (formData.targetAudience) {
        prompt += '👥 ĐỐI TƯỢNG KHÁCH HÀNG\n';
        prompt += `${formData.targetAudience}\n\n`;
      }
      
      if (formData.tone) {
        prompt += '💬 GIỌNG VĂN\n';
        prompt += `${formData.tone}\n\n`;
      }
      
      if (formData.promotion) {
        prompt += '🎁 ƯU ĐÃI & KHUYẾN MÃI\n';
        prompt += `${formData.promotion}\n\n`;
      }
      
      if (formData.timing) {
        prompt += '📅 THỜI ĐIỂM TRIỂN KHAI\n';
        prompt += `${formData.timing}\n\n`;
      }
      
      prompt += '═══════════════════════════════════════════════════════════\n\n';
      prompt += '🎯 YÊU CẦU TẠO NỘI DUNG\n\n';
      prompt += 'Dựa trên toàn bộ thông tin được cung cấp ở trên, hãy tạo một nội dung\n';
      prompt += 'marketing chuyên nghiệp, hấp dẫn và thu hút khách hàng. Nội dung cần:\n\n';
      prompt += '✓ Phù hợp với phong cách và đối tượng khách hàng đã chọn\n';
      prompt += '✓ Sử dụng giọng văn phù hợp\n';
      prompt += '✓ Làm nổi bật ưu đãi và thời điểm đặc biệt\n';
      prompt += '✓ Tạo cảm giác cấp thiết và khơi gợi hành động mua hàng\n';
      prompt += '✓ Tối ưu cho các kênh social media và website\n';
      
      setGeneratedContent(prompt);
      setLoading(false);
      setApiResponse('');
      setError(prev => ({ ...prev, api: '' }));
    }, 800);
  };

  const submitPromptToAPI = async () => {
    if (!generatedContent) {
      showToast('⚠️ Vui lòng tạo prompt trước khi gửi!', 'info');
      return;
    }

    setSubmitting(true);
    setError(prev => ({ ...prev, api: '' }));

    try {
      const formData = new FormData();
      formData.append('field-0', generatedContent);

      const response = await fetch('http://localhost:5678/form/6e9f8a5b-2f3b-4ea5-927d-76a9a34febc9', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setApiResponse(JSON.stringify(result, null, 2));
      showToast('✅ Đã gửi prompt thành công!');
    } catch (err) {
      console.error('Error submitting prompt:', err);
      setError(prev => ({ ...prev, api: err.message }));
      showToast('❌ Lỗi khi gửi prompt: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    showToast('✅ Đã copy prompt vào clipboard!');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      products: [],
      categories: [],
      style: '',
      targetAudience: '',
      tone: '',
      promotion: '',
      timing: ''
    });
    setGeneratedContent('');
  };

  const getSelectedProductNames = () => {
    return formData.products.map(id => {
      const product = products.find(p => p.variantId === parseInt(id));
      return product ? `${product.name} - ${product.size}` : '';
    });
  };

  const getSelectedCategoryNames = () => {
    return formData.categories.map(id => {
      const category = categories.find(c => c.id === parseInt(id));
      return category ? category.name : '';
    });
  };

  return (
    <div style={styles.container}>
      {/* Rendering bubbles */}
      {bubbles.map((bubble, index) => (
        <div key={index} style={bubble}></div>
      ))}
      
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <Sparkles size={42} />
            Content Generator Pro
          </h1>
          <p style={styles.subtitle}>Tạo prompt marketing chuyên nghiệp từ nhiều nguồn dữ liệu</p>
        </div>

        <div style={styles.mainGrid}>
          {/* Left Column */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <MessageSquare style={styles.icon} />
              Thông tin cơ bản
            </h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <TrendingUp size={16} />
                Tiêu đề chiến dịch
              </label>
              <input
                type="text"
                style={{
                  ...styles.input,
                  ...(focusedInput === 'title' ? styles.inputFocus : {})
                }}
                placeholder="VD: Flash Sale Cuối Tuần - Giảm Giá Sốc"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onFocus={() => setFocusedInput('title')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <MessageSquare size={16} />
                Mô tả chi tiết
              </label>
              <textarea
                style={{
                  ...styles.textarea,
                  ...(focusedInput === 'description' ? styles.inputFocus : {})
                }}
                placeholder="Mô tả chi tiết về chiến dịch, mục tiêu và thông điệp muốn truyền tải..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                onFocus={() => setFocusedInput('description')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.sectionDivider}></div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Package size={16} />
                Chọn sản phẩm (Ctrl/Cmd + Click để chọn nhiều)
              </label>
              <div style={styles.multiSelectWrapper}>
                <select
                  multiple
                  style={styles.multiSelect}
                  onChange={(e) => handleMultiSelectChange('products', e.target)}
                  value={formData.products}
                >
                  {products.map(product => (
                    <option key={product.variantId} value={product.variantId} style={styles.selectOption}>
                      {product.name} - {product.brand} (Size: {product.size}, Màu: {product.color.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>
              {error.products && <p style={styles.errorText}>❌ {error.products}</p>}
              <div style={styles.selectedItems}>
                {formData.products.length > 0 ? (
                  getSelectedProductNames().map((name, idx) => (
                    <span 
                      key={idx} 
                      style={{
                        ...styles.tag,
                        ...(hoveredTag === `product-${idx}` ? styles.tagHover : {})
                      }}
                      onMouseEnter={() => setHoveredTag(`product-${idx}`)}
                      onMouseLeave={() => setHoveredTag(null)}
                    >
                      {name}
                      <span 
                        style={styles.removeTag}
                        onClick={() => removeSelectedItem('products', formData.products[idx])}
                      >
                        ×
                      </span>
                    </span>
                  ))
                ) : (
                  <span style={styles.emptyState}>Chưa chọn sản phẩm nào</span>
                )}
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Tag size={16} />
                Chọn danh mục (Ctrl/Cmd + Click để chọn nhiều)
              </label>
              <div style={styles.multiSelectWrapper}>
                <select
                  multiple
                  style={styles.multiSelect}
                  onChange={(e) => handleMultiSelectChange('categories', e.target)}
                  value={formData.categories}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id} style={styles.selectOption}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {error.categories && <p style={styles.errorText}>❌ {error.categories}</p>}
              <div style={styles.selectedItems}>
                {formData.categories.length > 0 ? (
                  getSelectedCategoryNames().map((name, idx) => (
                    <span 
                      key={idx} 
                      style={{
                        ...styles.tag,
                        ...(hoveredTag === `category-${idx}` ? styles.tagHover : {})
                      }}
                      onMouseEnter={() => setHoveredTag(`category-${idx}`)}
                      onMouseLeave={() => setHoveredTag(null)}
                    >
                      {name}
                      <span 
                        style={styles.removeTag}
                        onClick={() => removeSelectedItem('categories', formData.categories[idx])}
                      >
                        ×
                      </span>
                    </span>
                  ))
                ) : (
                  <span style={styles.emptyState}>Chưa chọn danh mục nào</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <Sparkles style={styles.icon} />
              Tùy chỉnh nội dung
            </h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <TrendingUp size={16} />
                Phong cách
              </label>
              <select
                style={styles.select}
                value={formData.style}
                onChange={(e) => handleInputChange('style', e.target.value)}
              >
                <option value="">-- Chọn phong cách --</option>
                <option value="Sang trọng, cao cấp">🎩 Sang trọng, cao cấp</option>
                <option value="Trẻ trung, năng động">⚡ Trẻ trung, năng động</option>
                <option value="Tối giản, hiện đại">✨ Tối giản, hiện đại</option>
                <option value="Cổ điển, thanh lịch">👔 Cổ điển, thanh lịch</option>
                <option value="Thời thượng, phá cách">🚀 Thời thượng, phá cách</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <User size={16} />
                Đối tượng khách hàng
              </label>
              <select
                style={styles.select}
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              >
                <option value="">-- Chọn đối tượng --</option>
                <option value="Gen Z (18-25 tuổi)">🎮 Gen Z (18-25 tuổi)</option>
                <option value="Millennials (26-40 tuổi)">💼 Millennials (26-40 tuổi)</option>
                <option value="Gen X (41-56 tuổi)">👨‍💼 Gen X (41-56 tuổi)</option>
                <option value="Doanh nhân, chuyên gia">💎 Doanh nhân, chuyên gia</option>
                <option value="Sinh viên, học sinh">🎓 Sinh viên, học sinh</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <MessageSquare size={16} />
                Giọng văn
              </label>
              <select
                style={styles.select}
                value={formData.tone}
                onChange={(e) => handleInputChange('tone', e.target.value)}
              >
                <option value="">-- Chọn giọng văn --</option>
                <option value="Chuyên nghiệp, lịch sự">🎯 Chuyên nghiệp, lịch sự</option>
                <option value="Thân thiện, gần gũi">😊 Thân thiện, gần gũi</option>
                <option value="Hài hước, vui tươi">😄 Hài hước, vui tươi</option>
                <option value="Cảm xúc, truyền cảm hứng">❤️ Cảm xúc, truyền cảm hứng</option>
                <option value="Khẩn cấp, kích thích">⚡ Khẩn cấp, kích thích</option>
              </select>
            </div>

            <div style={styles.sectionDivider}></div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Gift size={16} />
                Ưu đãi & Khuyến mãi
              </label>
              <input
                type="text"
                style={{
                  ...styles.input,
                  ...(focusedInput === 'promotion' ? styles.inputFocus : {})
                }}
                placeholder="VD: Giảm 30%, Mua 1 tặng 1, Freeship..."
                value={formData.promotion}
                onChange={(e) => handleInputChange('promotion', e.target.value)}
                onFocus={() => setFocusedInput('promotion')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Calendar size={16} />
                Thời điểm triển khai
              </label>
              <select
                style={styles.select}
                value={formData.timing}
                onChange={(e) => handleInputChange('timing', e.target.value)}
              >
                <option value="">-- Chọn thời điểm --</option>
                <option value="Tết Nguyên Đán">🎊 Tết Nguyên Đán</option>
                <option value="Black Friday">🛍️ Black Friday</option>
                <option value="Cuối tuần">📅 Cuối tuần</option>
                <option value="Khai trương">🎉 Khai trương</option>
                <option value="Mùa hè">☀️ Mùa hè</option>
                <option value="Mùa đông">❄️ Mùa đông</option>
                <option value="8/3 - Ngày Quốc tế Phụ nữ">🌹 8/3 - Ngày Quốc tế Phụ nữ</option>
                <option value="20/10 - Ngày Phụ nữ Việt Nam">💐 20/10 - Ngày Phụ nữ Việt Nam</option>
                <option value="Sinh nhật thương hiệu">🎂 Sinh nhật thương hiệu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.card}>
          <div style={styles.buttonGroup}>
            <button 
              style={{
                ...styles.button,
                background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                boxShadow: '0 8px 20px rgba(33, 150, 243, 0.25)',
                ...(hoveredButton === 'submit' ? styles.buttonHover : {})
              }}
              onClick={submitPromptToAPI}
              disabled={submitting || !generatedContent}
              onMouseEnter={() => setHoveredButton('submit')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Send size={20} />
              {submitting ? 'Đang gửi...' : 'Tạo bài viết'}
            </button>
            
            <button 
              style={{
                ...styles.button,
                ...(hoveredButton === 'generate' ? styles.buttonHover : {})
              }}
              onClick={generateContent}
              disabled={loading}
              onMouseEnter={() => setHoveredButton('generate')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <Sparkles size={20} />
              {loading ? 'Đang tạo prompt...' : 'Preview'}
            </button>
            
            <button 
              style={{
                ...styles.button,
                ...styles.resetButton,
                ...(hoveredButton === 'reset' ? styles.buttonHover : {})
              }}
              onClick={resetForm}
              onMouseEnter={() => setHoveredButton('reset')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <RefreshCw size={20} />
              Làm mới
            </button>
          </div>
          {error.api && <p style={styles.errorText}>❌ {error.api}</p>}
        </div>

        {/* Output */}
        {generatedContent && (
          <div style={styles.outputCard}>
            <div style={styles.outputHeader}>
              <h2 style={styles.cardTitle}>
                <Sparkles style={styles.icon} />
                Prompt đã tạo
              </h2>
              <button 
                style={{
                  ...styles.copyButton,
                  ...(hoveredButton === 'copy' ? styles.buttonHover : {})
                }}
                onClick={copyToClipboard}
                onMouseEnter={() => setHoveredButton('copy')}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <Copy size={18} />
                Copy Prompt
              </button>
            </div>
            <div style={styles.outputContent}>
              {loading ? (
                <span style={styles.loadingText}>
                  <RefreshCw size={16} style={{animation: 'spin 1s linear infinite'}} />
                  Đang tạo prompt chuyên nghiệp...
                </span>
              ) : (
                generatedContent
              )}
            </div>
            <Toast toasts={toasts} removeToast={removeToast} />
          </div>
        )}

        {/* API Response */}
        {apiResponse && (
          <div style={styles.outputCard}>
            <div style={styles.outputHeader}>
              <h2 style={styles.cardTitle}>
                <Send style={styles.icon} />
                Phản hồi từ API
              </h2>
            </div>
            <div style={styles.outputContent}>
              {apiResponse}
            </div>
          </div>
        )}
      </div>
      
      {/* Improved Animation and Styling */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-15px) translateX(10px);
          }
          50% {
            transform: translateY(-7px) translateX(-5px);
          }
          75% {
            transform: translateY(8px) translateX(5px);
          }
        }
        
        input:focus, textarea:focus, select:focus {
          border-color: #de326f !important;
          background-color: #fff !important;
          box-shadow: 0 0 0 3px rgba(222, 50, 111, 0.1) !important;
        }
        
        select option {
          padding: 0.75rem;
        }
        
        button:hover {
          transform: translateY(-2px);
        }
        
        button:active {
          transform: translateY(0);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(222, 50, 111, 0.12);
        }
        
        @media (max-width: 1200px) {
          .mainGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ContentGenerator;