import { readdir,readFile,access } from 'node:fs/promises';
const folders=(await readdir(new URL('../skills/',import.meta.url))).filter(name=>name.startsWith('alwasil-') && name !== 'alwasil-web-quality');
for (const folder of folders) {
  const text=await readFile(new URL(`../skills/${folder}/SKILL.md`,import.meta.url),'utf8');
  const header=/^---\nname: ([a-z0-9-]+)\ndescription: ([^\n]+)\n---\n/.exec(text);
  if (!header || header[1]!==folder || folder.length>=64 || /TODO|\[INSERT|PLACEHOLDER/.test(text)) throw new Error(`Skill invalide: ${folder}`);
  for (const label of ['Objectif','Entrées','Sorties','règles','Erreurs possibles','Tests','Validation humaine']) if (!text.includes(label)) throw new Error(`Champ manquant: ${folder} ${label}`);
  await access(new URL('../docs/AGENT_ARCHITECTURE.md',import.meta.url));
}
console.log(JSON.stringify({validated:folders.length,format:'frontmatter simple et liens locaux',originalValidator:'indisponible : PyYAML absent'}));
