import { build } from 'vitepress';

build('docs').catch(err => {
  console.error(err);
  process.exit(1);
});
