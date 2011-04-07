#!/usr/bin/env python

import cgi
import logging
import os.path
import wsgiref.handlers
import simplejson as json
import time
import urllib


from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from properties.setproperties import AToZProperties
from properties.setproperties import CommonProperties
from properties.setproperties import CategoryProperties

class HomeHandler(webapp.RequestHandler):
  def get(self, urlPath):
	path = os.path.join(os.path.dirname(__file__),'index.html')
	common = CommonProperties()
	common = common.load()
	content = AToZProperties()
	content = content.load()
	categories = CategoryProperties()
	categories = categories.load()
	args = dict(urlPath=urlPath,content=content,common=common,categories=categories)
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
