const { newEnforcer } = require('casbin');
const path = require('path');

let enforcer;

async function initCasbin() {
  if (!enforcer) {
    const modelPath = path.join(__dirname, 'model.conf');
    const policyPath = path.join(__dirname, 'policy.csv');
    enforcer = await newEnforcer(modelPath, policyPath);
  }
  return enforcer;
}

module.exports = { initCasbin };