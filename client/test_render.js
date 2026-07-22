import { createServer } from 'vite';

async function test() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  try {
    const { renderToString } = await vite.ssrLoadModule('react-dom/server');
    const React = await vite.ssrLoadModule('react');
    const AnswerPanel = await vite.ssrLoadModule('/src/components/Game/AnswerPanel.jsx');
    
    console.log("AnswerPanel module:", AnswerPanel);
    
    // Try to render
    const html = renderToString(React.createElement(AnswerPanel.default));
    console.log("RENDER SUCCESS!");
  } catch (e) {
    console.error("RENDER ERROR:", e);
  } finally {
    vite.close();
  }
}

test();
