// commit规范： <类型>(影响的作用域): <简要描述>
module.exports = {
  // 修改性质
  types: [
    {
      value: ':sparkles: feat',
      name: '✨ feat:     新功能',
    },
    {
      value: ':bug: fix',
      name: '🐛 fix:      修复bug',
    },
    {
      value: ':tada: init',
      name: '🎉 init:     初始化',
    },
    {
      value: ':pencil2: docs',
      name: '✏️  docs:     文档变更',
    },
    {
      value: ':lipstick: style',
      name: '💄 style:    代码的样式美化',
    },
    {
      value: ':recycle: refactor',
      name: '♻️  refactor: 重构',
    },
    {
      value: ':zap: perf',
      name: '⚡️ perf:     性能优化',
    },
    {
      value: ':white_check_mark: test',
      name: '✅ test:     测试',
    },
    {
      value: ':rewind: revert',
      name: '⏪️ revert:   回退',
    },
    {
      value: ':package: build',
      name: '📦️ build:    打包',
    },
    {
      value: ':rocket: chore',
      name: '🚀 chore:    构建/工程依赖/工具',
    },
    {
      value: ':construction_worker: ci',
      name: '👷 ci:       CI related changes',
    },
  ],
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope(可选):',
    customScope: '请输入修改范围(可选)',
    subject: '简要说明(必填):\n',
    // body: '详细说明，使用"|"换行(可选)：\n',
    // breaking: '非兼容性说明 (可选):\n',
    // footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交?',
  },
  // 修改范围
  // scopes: [
  //   ['business', '业务模块'],
  //   ['components', '公共模块'],
  //   ['config', '配置相关'],
  //   ['styles', '样式相关'],
  //   ['utils', 'utils相关'],
  //   ['docs', '文档相关'],
  //   ['others', '其他'],
  //   ['*', '多个模块'],
  //   // 如果选择 custom,后面会让你再输入一个自定义的 scope
  //   ['custom', '都不是？自定义'],
  // ].map(([value, description]) => {
  //   return {
  //     value,
  //     name: `${value.padEnd(30)} (${description})`,
  //   };
  // }),
  allowCustomScopes: false,
  allowBreakingChanges: [],
  // Body: 对 subject 的补充。可以多行。Footer: 主要是一些关联 issue 的操作。
  skipQuestions: ['body', 'footer'],
  // 描述的长度限制
  subjectLimit: 100,
};
