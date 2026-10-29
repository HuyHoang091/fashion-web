import React, { useState, useEffect } from "react";
import axios from "axios";
import HeroSection from "./HeroSection";
import QuickCategories from "../../components/QuickCategories/QuickCategories";
import FeaturedProduct from "../../layouts/FeaturedProductLayout";
import CardProduct from "../../components/Card/CardProduct";
import AiFeaturesBanner from "./AiFeaturesBanner";
import SaleLayout from "../../layouts/SaleLayout";
import SaleProduct from "../../components/Card/SaleProduct";
import Footer from "../../components/Footer/Footer"
import IconAI from "../../components/Button/IconAI";

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format price từ số sang định dạng chuỗi với K
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(3)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return `${price}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/info`);
        if (Array.isArray(response.data)) {
          // Lấy 4 sản phẩm đầu tiên cho featured products
          const featured = response.data.slice(0, 4).map(product => ({
            icon: product.url || "/clothes/dress1.png", // Sử dụng ảnh mặc định nếu không có url
            lable: `💎 ${product.brand || 'LUXURY'}`,
            lable1: "🤖 AI FIT",
            nameProduct: product.name || "Unnamed Product",
            describe: product.description || "No description available",
            evaluate: product.rating || 5,
            numberReview: `${product.numberReview || 0} reviews`,
            current: formatPrice(product.priceNow || product.price || 0),
            old: formatPrice(product.price || 0),
            colors: product.colors ? product.colors.map(color => color.code) : ["#000000"]
          }));
          setFeaturedProducts(featured);

          // Lọc các sản phẩm sale (priceNow < price) và lấy 4 sản phẩm
          const onSale = response.data
            .filter(product => product.priceNow && product.price && product.priceNow < product.price)
            .slice(0, 4)
            .map(product => ({
              icon: product.url || "/clothes/dress1.png",
              nameProduct: product.name || "Unnamed Product",
              current: formatPrice(product.priceNow || 0),
              old: formatPrice(product.price || 0)
            }));
          setSaleProducts(onSale);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        // Sử dụng dữ liệu mẫu khi có lỗi
        setFeaturedProducts([
          {
            icon: "/clothes/dress1.png", 
            lable: "💎 LUXURY", 
            lable1: "🤖 AI FIT", 
            nameProduct: "Silk Blouse Premium", 
            describe: "100% Mulberry Silk Handcrafted in Italy", 
            evaluate: 5, 
            numberReview: "243 reviews", 
            current: "2.890K", 
            old: "4.320K", 
            colors: ["red", "blue", "black"]
          },
          {
            icon: "👚", 
            lable: "💎 LUXURY", 
            lable1: "🤖 AI FIT", 
            nameProduct: "Silk Blouse Premium", 
            describe: "100% Mulberry Silk Handcrafted in Italy", 
            evaluate: 5, 
            numberReview: "243 reviews", 
            current: "2.890K", 
            old: "4.320K", 
            colors: ["red", "blue", "black"]
          },
          {
            icon: "👚", 
            lable: "💎 LUXURY", 
            lable1: "🤖 AI FIT", 
            nameProduct: "Silk Blouse Premium", 
            describe: "100% Mulberry Silk Handcrafted in Italy", 
            evaluate: 5, 
            numberReview: "243 reviews", 
            current: "2.890K", 
            old: "4.320K", 
            colors: ["red", "blue", "black"]
          },
          {
            icon: "👚", 
            lable: "💎 LUXURY", 
            lable1: "🤖 AI FIT", 
            nameProduct: "Silk Blouse Premium", 
            describe: "100% Mulberry Silk Handcrafted in Italy", 
            evaluate: 5, 
            numberReview: "243 reviews", 
            current: "2.890K", 
            old: "4.320K", 
            colors: ["red", "blue", "black"]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <HeroSection />
      <QuickCategories />
      <FeaturedProduct>
        {featuredProducts.length > 0 ? featuredProducts.map((card, index) => (
          <CardProduct 
            key={index}
            icon={card.icon}
            lable={card.lable}
            lable1={card.lable1}
            nameProduct={card.nameProduct}
            describe={card.describe}
            evaluate={card.evaluate}
            numberReview={card.numberReview}
            current={card.current}
            old={card.old}
            colors={card.colors}
          />
        )) : (
          // Placeholder nếu không có sản phẩm
          <div>Loading featured products...</div>
        )}
      </FeaturedProduct>
      <AiFeaturesBanner />
      
      {/* Chỉ hiển thị phần Sale khi có sản phẩm giảm giá */}
      {saleProducts.length > 0 && (
        <SaleLayout endTime="2025-10-26T23:59:59+07:00">
          {saleProducts.map((item, idx) => (
            <SaleProduct items={item} key={idx} />
          ))}
        </SaleLayout>
      )}
      
      <IconAI />
      <Footer />
    </>
  );
};

export default LandingPage;