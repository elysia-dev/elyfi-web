// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/proxy', {
      target: 'https://forum.elyfi.world',
      changeOrigin: true,
      pathRewrite: { '^/proxy': '' },
    }),
  );
};
