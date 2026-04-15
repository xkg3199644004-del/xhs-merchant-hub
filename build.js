import { build } from 'vitepress';

build({
  root: 'docs',
}).catch(err => {
  console.error(err);
  process.exit(1);
});
