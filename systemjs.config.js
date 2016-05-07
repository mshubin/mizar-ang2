(function(global) {

  // paths
  var paths = {
    "local/*": "vendor/*"
  };
  // map tells the System loader where to look for things
  var map = {
    'app':                        'app', // 'dist',
    'rxjs':                       'node_modules/rxjs',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    '@angular':                   'node_modules/@angular',
    'GlobWebModule':                    'local/GlobWeb'
    '@angular2-material':         'node_modules/@angular2-material',
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'build':                      { main: 'main.js', defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { defaultExtension: 'js' },
    'GlobWebModule':              { main: 'src/GlobWeb.js', defaultExtension:'js', meta: { './GlobWeb.js': {
      format: 'amd'
    } } }
    '@angular2-material/sidenav': { main: 'sidenav.js', defaultExtension: 'js', format: 'cjs'},
    '@angular2-material/core': { main: 'core.js', defaultExtension: 'js', format: 'cjs'},
    '@angular2-material/button': { main: 'button.js', defaultExtension: 'js', format: 'cjs'},
    '@angular2-material/list': { main: 'list.js', defaultExtension: 'js', format: 'cjs'},
  };

  var packageNames = [
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/router-deprecated',
    '@angular/testing',
    '@angular/upgrade',
    'GlobWeb'
  ];

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
    paths: paths,
    map: map,
    packages: packages
  }

  // filterSystemConfig - index.html's chance to modify config before we register it.
  if (global.filterSystemConfig) { global.filterSystemConfig(config); }

  System.config(config);

})(this);
