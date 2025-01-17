import fs from 'fs'
import glob from 'glob'
import sizeOf from 'image-size'
import yaml from 'js-yaml'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const asset_dir = `../assets`

const slugs = fs
  .readdirSync(asset_dir, { withFileTypes: true })
  .filter((itm) => itm.isDirectory())
  .map((dir) => dir.name) // remove hidden system files

const tikz_figures = slugs.map((slug) => {
  const fig_dir = `${asset_dir}/${slug}/${slug}`

  const downloads = glob
    .sync(`${fig_dir}*.{png,pdf,svg,tex}`)
    .map((str) => str.split(`/`).at(-1))

  const code = fs.readFileSync(`${fig_dir}.tex`, `utf8`)

  const { width, height } = sizeOf(`${fig_dir}.png`)
  const metadata = yaml.load(fs.readFileSync(`${fig_dir}.yml`))

  if (metadata.description) {
    metadata.description = unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeKatex)
      .use(rehypeStringify)
      .processSync(metadata.description).value
  }

  // assemble TeX file attributes
  return { ...metadata, slug, width, height, downloads, code }
})

fs.writeFileSync(
  `src/slugs.ts`,
  `export default ` + JSON.stringify(slugs, null, 2)
)
fs.writeFileSync(
  `src/tikz-figures.ts`,
  `export default ` + JSON.stringify(tikz_figures, null, 2)
)
