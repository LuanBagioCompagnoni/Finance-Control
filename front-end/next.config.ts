module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/sign-in',
        permanent: false,
      },
    ]
  },
}
