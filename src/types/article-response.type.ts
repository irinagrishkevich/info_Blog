export type ArticleResponseType = {
  count: number,
  pages: number,
  items: {
    id: string,
    title: string,
    description: string,
    image: string,
    date: string,
    category: string,
    url: string
  }[]
}
