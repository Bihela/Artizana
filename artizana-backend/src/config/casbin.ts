import { newEnforcer } from 'casbin';
import path from 'path';

let enforcer: any;

export async function initCasbin() {
  if (!enforcer) {
    const modelPath = path.join(__dirname, 'model.conf');
    const policyPath = path.join(__dirname, 'policy.csv');
    enforcer = await newEnforcer(modelPath, policyPath);
  }
  return enforcer;
}