export default {
  entry: 'index.js',
  dest: 'bundles/ng-cache.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'gyunu.ng-cache',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/http': 'ng.http',
    '@ionic-native/native-storage': 'ionic-native.native-storage',
    '@ionic/storage': 'ionic.storage',
    'rxjs/Observable': 'Rx',
    'rxjs/add/operator/catch': 'Rx.Observable.prototype',
    'rxjs/add/operator/map': 'Rx.Observable.prototype'
  }
}
