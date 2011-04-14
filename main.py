#!/usr/bin/env python
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from google.appengine.dist import use_library
use_library('django', '1.2')

import cgi
import logging
import os.path
import wsgiref.handlers
import simplejson as json
import time

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from properties.setproperties import AToZProperties
from properties.setproperties import AToZList
from properties.setproperties import CommonProperties
from properties.setproperties import CategoryProperties
from google.appengine.api import images

common = CommonProperties()
common = common.load()
content = AToZProperties()
content = content.load()
categories = CategoryProperties()
categories = categories.load()
AToZList = AToZList()
AToZList = AToZList.load()

regexpURLAtoZ = r"/(\bfood\b|\bpeople\b|\bplanet\b|\bcommunity\b|\blondon2012\b|[a-zA-Z]{1})*"
regexpURLAll = r"/(.*)"

class HomeHandler(webapp.RequestHandler):
  def get(self, urlPath):
	logging.info(urlPath)
	timestamp = time.time()
	alpha = ""
	category = ""
	path = os.path.join(os.path.dirname(__file__),'index.html')
	if urlPath is not None:
		if len(urlPath) < 2:
			alpha = urlPath
		else:
			category = urlPath

	args = dict(timestamp=timestamp,alpha=alpha,category=category,content=content,common=common,categories=categories,aToZList=json.dumps(AToZList))
	self.response.out.write(template.render(path,args))
  def post(self, urlPath):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    args = dict(urlPath=urlPath)
    self.response.out.write(template.render(path,args))

def main():
  util.run_wsgi_app(webapp.WSGIApplication([
	(regexpURLAtoZ,HomeHandler)
  ]))

if __name__ == '__main__':
  main()
