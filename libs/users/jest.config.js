module.exports = {
  name: 'users',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/users',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
