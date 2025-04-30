const config = {
  urls: {
    protocol: 'http://',
    serverIp: '192.168.0.28',
    port: '3010',

    server: '',
    graphql: '', 
  },
};

config.urls.server = `${config.urls.protocol}${config.urls.serverIp}:${config.urls.port}`;
config.urls.graphql = `${config.urls.server}/graphql`;

export default config;