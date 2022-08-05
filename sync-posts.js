import { Client } from '@notionhq/client'
import dotenv from 'dotenv'
import { NotionToMarkdown } from 'notion-to-md'
import * as fs from 'fs'
import dayjs from 'dayjs'

dotenv.config()
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})
const n2m = new NotionToMarkdown({ notionClient: notion})
const kebabCase = str => str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .join('-')
        .toLowerCase();

const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
})

const pages = response
  .results
  .filter(x => x?.object === 'page')

pages.map(async x => {
  const title = (await notion.pages.properties.retrieve({
    page_id: x.id,
    property_id: 'title',
  })).results[0].title.plain_text

  const tags = (await notion.pages.properties.retrieve({
    page_id: x.id,
    property_id: 'mntZ',
    }))
    .multi_select
    .map(t => `  - ${t.name}`)
    .join('\n')

  const createdTime = dayjs(x.created_time).format('YYYY-MM-DD')

  console.dir(createdTime, {depth: null})

  const mdBlocks = await n2m.pageToMarkdown(x.id)
  const content = n2m.toMarkdownString(mdBlocks)

  const folderName = `./content/blog/${createdTime}-${kebabCase(title)}`
  const pageContent =
`---
title: ${title}
date: ${createdTime}
tags:
${tags}
---
${content}
`
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  fs.writeFileSync(`${folderName}/index.md`, pageContent);
  return
});
