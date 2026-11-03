import { useEffect } from 'react';
import Header from './components/Header.jsx';
import { Router, useRouter } from './router.jsx';
import { navigation } from './content.js';
import { Home, Services, Capabilities, Products, Quality, Process, About, FAQ, Contact, NotFound, Footer } from './components/SitePages.jsx';
import FAQAssistant from './components/FAQAssistant.jsx';

const pages = { '/': Home, '/services': Services, '/capabilities': Capabilities, '/products': Products, '/quality': Quality, '/process': Process, '/about': About, '/faq': FAQ, '/contact': Contact };
function Website() {
  const { location } = useRouter();
  const Page = pages[location] || NotFound;
  useEffect(() => {
    const title = navigation.find(([path]) => path === location)?.[1] || 'Page not found';
    document.title = `${title === 'Home' ? 'Cosmetics, engineered.' : title} | Babylon`;
  }, [location]);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header />
    <main id="main-content" tabIndex={-1}><Page /></main>
    <Footer />
    <FAQAssistant />
  </>;
}
export default function App() { return <Router><Website /></Router>; }
