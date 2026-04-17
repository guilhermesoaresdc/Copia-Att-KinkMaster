import * as fs from 'fs';
const content = fs.readFileSync('/app/applet/components/QuizFunnel.tsx', 'utf8');
const fixed = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('/app/applet/components/QuizFunnel.tsx', fixed);
