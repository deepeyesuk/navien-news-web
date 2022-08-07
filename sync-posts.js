const { Client } = require('@notionhq/client')
const dotenv = require('dotenv')
const { NotionToMarkdown } = require('notion-to-md')
const fs = require('fs')
const dayjs = require('dayjs')

dotenv.config()
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})
const n2m = new NotionToMarkdown({ notionClient: notion})
const kebabCase = str => str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .join('-')
        .toLowerCase();

notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
}).then(response => {
  const pages = response
    .results
    .filter(x => x?.object === 'page')

  pages.map(async x => {
    const properties = (await notion.pages.properties.retrieve({
      page_id: x.id,
      property_id: 'title',
    }))
    if (properties.results.length === 0) {
      return
    }

    console.dir(properties, { depth: null })

    const title = (await notion.pages.properties.retrieve({
      page_id: x.id,
      property_id: 'title',
    })).results[0].title.plain_text



    const publishedDate = dayjs(x.created_time).format('YYYY-MM-DDTHH:mm:ssZ')

    console.dir(publishedDate, {depth: null})

    const mdBlocks = await n2m.pageToMarkdown(x.id)
    const content = n2m.toMarkdownString(mdBlocks)

    const folderName = `./content/blog/${kebabCase(title)}`
    const pageContent =
`---
title: "${title}"
date: "${publishedDate}"
---
${content}
`
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }

    fs.writeFileSync(`${folderName}/index.md`, pageContent);
    return
  });
})

