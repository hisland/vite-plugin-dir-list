const path = require('path')
const fs = require('fs')

function genDirListHtml(list) {
  return `
  <style>
  a{line-height: 1.8em;}
  a:hover{color:darkcyan}
  </style>
  <ul>
  ${list.map((vv) => `<li><a href="${vv}">${vv}</a></li>`).join('')}
  </ul>`
}

module.exports = function dirListPlugin() {
  return {
    name: 'vite-plugin-dir-list',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const { url } = req
        if (url.endsWith('/')) {
          const pwd = path.join(process.cwd(), url)
          const list1 = fs.readdirSync(pwd, {
            withFileTypes: true,
          })

          const hasIndex = list1.some((vv) => vv.name === 'index.html')
          if (hasIndex) {
            res.writeHead(301, { Location: 'index.html' })
            res.end()
            // res.end(fs.readFileSync(path.join(pwd, 'index.html'), 'utf8'))
          } else {
            const list2 = list1.map((file) => {
              if (file.isDirectory()) {
                return file.name + '/'
              } else {
                return file.name
              }
            })
            res.end(genDirListHtml(list2))
          }
        } else {
          next()
        }
      })
    },
  }
}
