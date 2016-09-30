import feedparser
import json

f = open('nyt.txt', 'w')

articles=[];
d = feedparser.parse('http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml')
length = len(d['entries'])
for entry in d['entries']:
	title = entry['title'];
	summary = (entry['summary']).encode('ascii', 'ignore')
	article = {'Title': title, 'Summary': summary, 'PubDate': entry.published}
	articles.append(article)
json.dump(articles, f)
f.close()


f2 = open('wsj.txt', 'w')

articles=[];
d = feedparser.parse('http://www.wsj.com/xml/rss/3_7085.xml')
length = len(d['entries'])
for entry in d['entries']:
	title = entry['title'];	
	summary = (entry['summary']).encode('ascii', 'ignore')
	article = {'Title': title, 'Summary': summary, 'PubDate': entry.published}
	articles.append(article)
json.dump(articles, f2)
f2.close()

f3 = open('breitbart.txt', 'w')

articles=[];
d = feedparser.parse('http://feeds.feedburner.com/breitbart?format=xml')
length = len(d['entries'])
for entry in d['entries']:
	title = (entry['title']).encode('ascii', 'ignore')
	summary = (entry['summary']).encode('ascii', 'ignore')
	article = {'Title': title, 'Summary': summary, 'PubDate': entry.published}
	articles.append(article)
json.dump(articles, f3)
f3.close()


f4 = open('fox.txt', 'w')

articles = [];
d = feedparser.parse('http://feeds.foxnews.com/foxnews/latest?format=xml')
length = len(d['entries'])
for entry in d['entries']:
	title = (entry['title']).encode('ascii', 'ignore')
	summary = (entry['summary']).encode('ascii', 'ignore')
	article = {'Title': title, 'Summary': summary, 'PubDate': entry.published}
	articles.append(article)
json.dump(articles, f4)
f4.close()


f5 = open('cnn.txt', 'w')

articles = [];
d = feedparser.parse('http://rss.cnn.com/rss/cnn_topstories.rss')
length = len(d['entries'])
for entry in d['entries']:
	title = (entry['title']).encode('ascii', 'ignore')
	summary = (entry['summary']).encode('ascii', 'ignore')
	article = {'Title': title, 'Summary': summary, 'PubDate': entry.published}
	articles.append(article)
json.dump(articles, f5)
f5.close()