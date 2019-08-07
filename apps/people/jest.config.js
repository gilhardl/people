module.exports = {
  name: 'people',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/people',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
