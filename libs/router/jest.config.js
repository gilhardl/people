module.exports = {
  name: 'router',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/router',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
