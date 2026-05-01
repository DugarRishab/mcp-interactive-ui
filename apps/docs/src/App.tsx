import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/hooks/use-theme';
import { DocsLayout } from '@/components/DocsLayout';
import Home from './pages/Home';
import Blocks from './pages/Blocks';
import BlockDetail from './pages/BlockDetail';
import Examples from './pages/Examples';
import GettingStarted from './pages/GettingStarted';
import Api from './pages/Api';
import PackageDetail from './pages/PackageDetail';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="mcp-docs-theme">
      <DocsLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/getting-started" element={<GettingStarted />} />
          <Route path="/blocks" element={<Blocks />} />
          <Route path="/blocks/:blockId" element={<BlockDetail />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/api" element={<Api />} />
          <Route path="/api/:packageId" element={<PackageDetail />} />
        </Routes>
      </DocsLayout>
    </ThemeProvider>
  );
}

export default App;
