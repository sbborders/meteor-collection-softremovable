Package.describe({
  git: 'https://github.com/sbborders/meteor-collection-softremovable.git',
  name: 'sbborders:collection-softremovable',
  summary: 'Add soft remove to collections',
  version: '2.0.1',
  documentation: 'README.md',
});

Package.onUse(function (api) {
  api.versionsFrom('2.8.0');

  api.use('ecmascript');

  api.use([
    'check',
    'underscore',
  ]);

  
  api.use([
    'aldeed:autoform@6.3.0 || 7.0.0',
    'aldeed:collection2@2.0.0 || 3.0.0',
  ], ['client', 'server'], { weak: true });
  
  api.use([
    'matb33:collection-hooks@1.3.1',
    'sbborders:collection-behaviours@2.0.1',
  ]);

  api.mainModule('softremovable.js');

});

