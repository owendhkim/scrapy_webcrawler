from pathlib import Path
import scrapy

class testSpider(scrapy.Spider):
    name = "links"
    visited_urls = set()

    def start_requests(self):
        with open('../../../seeds1.txt', 'r') as urls:
            for url in urls:
                clean_url = url.strip()  # Remove any leading/trailing whitespace
                yield scrapy.Request(url=clean_url, callback=self.parse)

    def parse(self, response):
        for link in response.css('a'):
            url = link.css('a::attr(href)').get()
            text = (link.css('a::text').get()).strip()
            if not url.startswith('https://') or url.startswith('http'):
                url = response.urljoin(link.css('a::attr(href)').get())
            if url in self.visited_urls:
                continue
            else:
                self.visited_urls.add(url)
                yield {
                    'url': url,
                    'text': text
                }