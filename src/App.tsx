import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
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

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/occasions" element={<OccasionsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<PostPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/states" element={<StatesPage />} />
            <Route path="/lookbook" element={<LookbookPage />} />
            <Route path="/case-study" element={<CaseStudyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  )
}
