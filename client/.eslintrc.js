module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-dupe-keys': 'off',
    'no-unreachable': 'off',
    'default-case': 'off',
    'import/no-anonymous-default-export': 'off'
  }
}; 