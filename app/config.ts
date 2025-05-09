const config = {
  urls: {
    protocol: 'http://',
    serverIp: '192.168.0.28',
    serverPort: '3010',
    socketPort: '3011',

    server: '',
    socket: '',
    graphql: '', 
  },
};

config.urls.server = `${config.urls.protocol}${config.urls.serverIp}:${config.urls.serverPort}`;
config.urls.socket = `${config.urls.protocol}${config.urls.serverIp}:${config.urls.socketPort}`;
config.urls.graphql = `${config.urls.server}/graphql`;

export default config;