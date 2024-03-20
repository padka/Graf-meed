import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext/AuthContext';
import { CartProvider } from './components/CartContext/CartContext';
import { FurnitureProvider } from './components/NavEl/context/FurnitureContext'; // Допустим, вы создали FurnitureProvider
import UserProfile from './components/UserProfile/UserProfile';
import FloatingIcons from "./components/NavEl/FloatingIcons";
import AdminPanel from './components/UserProfile/AdminPanel';

const Header = lazy(() => import('./components/Header/Header'));
const SliderComponent = lazy(() => import('./components/SliderComponent/SliderComponent'));
const IntroSection = lazy(() => import('./components/IntroSection/IntroSection'));
const Catalog = lazy(() => import('./components/Catalog/Catalog'));
const Footer = lazy(() => import('./components/Footer/Footer'));
const Cart = lazy(() => import('./components/Cart/Cart'));
const Adventage = lazy(() => import('./components/Adventage/Adventage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage/NotFoundpage'));
const FurnitureConstructor = lazy(() => import('./components/NavEl/components/FurnitureConstructor'));


const LoadingIndicator = () => (
  <div className="loading-indicator">
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">Загрузка...</span>
    </div>
  </div>
);

const IndexPage = () => (
  <>
    <SliderComponent />
    <Catalog />
    <Adventage />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FurnitureProvider> {/* Оборачиваем приложение в FurnitureProvider */}
            <div className="App">
              <Suspense fallback={<LoadingIndicator />}>
                <Header />
                <div className="content-wrapper">
                  <main>
                    <Routes>
                      <Route path="/about" element={<IntroSection />} />
                      <Route path="/catalog" element={<Catalog />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/constructor" element={<FurnitureConstructor />} />
                      <Route path="/" element={<IndexPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <FloatingIcons />
                </div>
                <Footer />
              </Suspense>
            </div>
          </FurnitureProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
