import { App } from '../packages/app/src'
import { staticHandler } from '../packages/static/src'
import { markdownStaticHandler as md } from '../packages/markdown/src'
import logger from '../packages/logger/src'

const app = new App()

app
  .use(logger())
  .use((req, _res, next) => {
    console.log(req.method)
    next()
  })
  .use(staticHandler('static'))
  .use(
    md('docs', {
      prefix: '/docs',
      stripExtension: true,
      markedExtensions: [
        {
          // @ts-ignore
          renderer: {
            heading(text, level) {
              const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')

              return `
              <h${level}>
                <a name="${escapedText}" class="anchor" href="#${escapedText}">
                  <span class="header-link"></span>
                </a>
                ${text}
              </h${level}>`
            }
          }
        }
      ]
    })
  )

app.listen(5555, () => console.log(`Running on http://localhost:5555`))
