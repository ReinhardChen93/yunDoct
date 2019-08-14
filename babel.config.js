module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    // 会在编译过程中将 import 的写法自动转换为按需引入的方式
    // 接着你可以在代码中直接引入 Vant 组件
    // 插件会自动将代码按需引入形式
    // import { Button } from 'vant';
    ['import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      },
      'vant'
      // 'syntax-dynamic-import'
    ]
  ]
}
