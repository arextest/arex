const proxy = [
  {
    path: '/report',
    target: 'http://10.5.153.1:8090/api',
  },
  {
    path: '/schedule',
    target: 'http://10.5.153.1:8092/api',
  },
  {
    path: '/storage',
    target: 'http://10.5.153.1:8093/api',
  },
];

export default proxy;
