import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { WishlistProvider } from './context/WishlistContext'
import { WishlistPage } from './pages/WishlistPage'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { ProductPage } from './pages/ProductPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { OccasionsPage } from './pages/OccasionsPage'
import { BlogPage, PostPage } from './pages/BlogPage'
import { MarketPage } from './pages/MarketPage'
import { AboutPage } from './pages/AboutPage'
import { LookbookPage } from './pages/LookbookPage'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { StatesPage } from './pages/StatesPage'
import { PolicyPage } from './pages/PolicyPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderPage } from './pages/OrderPage'
import { AccountPage } from './pages/AccountPage'
import { TrackPage } from './pages/TrackPage'
import { STORE } from './store.config'

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
              <ToastProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/occasions" element={<OccasionsPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<PostPage />} />
                    {STORE.features.marketFile && <Route path="/market" element={<MarketPage />} />}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/states" element={<StatesPage />} />
                    <Route path="/lookbook" element={<LookbookPage />} />
                    {STORE.features.caseStudy && <Route path="/case-study" element={<CaseStudyPage />} />}
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order/:ref" element={<OrderPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/track" element={<TrackPage />} />
                    <Route path="/track/:ref" element={<TrackPage />} />
                    <Route path="/policies/:slug" element={<PolicyPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Layout>
              </ToastProvider>
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
