Package.describe({
  git: 'https://github.com/sbborders/meteor-collection-softremovable.git',
  name: 'sbborders:collection-softremovable',
  summary: 'Add soft remove to collections',
  version: '3.0.0',
  documentation: 'README.md',
});

Package.onUse(function (api) {
  api.versionsFrom('3.0');

  api.use('ecmascript');

  api.use([
    'check',
  ]);


  api.use([
    'aldeed:autoform@8.0.0',
    'aldeed:collection2@4.0.0',
  ], ['client', 'server'], { weak: true });

  api.use([
    'matb33:collection-hooks@2.0.0',
    'sbborders:collection-behaviours@3.0.0',
  ]);

  api.mainModule('softremovable.js');

});