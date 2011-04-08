#!/usr/bin/env python

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

common = CommonProperties()
common = common.load()
content = AToZProperties()
content = content.load()
categories = CategoryProperties()
categories = categories.load()
AToZList = AToZList()
AToZList = AToZList.load()

class HomeHandler(webapp.RequestHandler):
  def get(self, urlPath):
	path = os.path.join(os.path.dirname(__file__),'index.html')
	# Check that the urlPath matches one of our categories
	filter = ""
	for x in categories:
		if urlPath == x:
			filter = x
	for y in AToZList:
		if urlPath == y:
			filter = y
	args = dict(filter=filter,content=content,common=common,categories=categories)
	self.response.out.write(template.render(path,args))
  def post(self, urlPath):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    args = dict(urlPath=urlPath)
    self.response.out.write(template.render(path,args))

def main():
  util.run_wsgi_app(webapp.WSGIApplication([
	(r'/(.*)',HomeHandler)
  ]))

if __name__ == '__main__':
  main()
