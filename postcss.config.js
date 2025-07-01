import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    autoprefixer({
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'iOS >= 10',
        'Safari >= 10',
        'Chrome >= 60',
        'Firefox >= 60',
        'Edge >= 16'
      ],
      grid: true,
      flexbox: 'no-2009'
    })
  ]
}
