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
from google.appengine.api import memcache
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

regexpURLAtoZ = r"/(food|people|planet|community|london2012|[a-z]{1})"
regexpURLError = r"/(.*)"

def getKeyCodes(self):
	"""
	Generate JavaScript numeric keyCodes for Categories
	Note that the categories must be return from the ConfigParser pre-sorted, or the keyCode reference will be out of sync
	"""
	counter = 49
	self._keyCodes = dict()
	for cat in categories:
		self._keyCodes[counter] = cat
		counter = counter + 1
		
	mcKeyCodes = memcache.get("categorykeycodes")
	if mcKeyCodes is not None:
		logging.info("Got categorykeycodes from memcache")
		return mcKeyCodes
	else:
		logging.info("NOT Got categorykeycodes from memcache")
		memcache.add("categorykeycodes", self._keyCodes)
		return self._keyCodes
	
class BaseHandler(webapp.RequestHandler):
  def get(self):
	if not hasattr(self, "_current_user"):
		self._urlPath = "/"
	return self._urlPath

class HomeHandler(BaseHandler):
  def get(self):
	timestamp = time.time()
	alpha = ""
	category = ""
	keyCodes = getKeyCodes(self)
	path = os.path.join(os.path.dirname(__file__),'index.html')
	args = dict(timestamp=timestamp,alpha=alpha,category=category,content=content,common=common,categories=categories,aToZList=json.dumps(AToZList),keyCodes=keyCodes)
	self.response.out.write(template.render(path,args))
  def post(self):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    self.response.out.write(template.render(path,{}))

		
class ViewHandler(BaseHandler):
  def get(self, urlPath):
	timestamp = time.time()
	alpha = ""
	category = ""
	path = os.path.join(os.path.dirname(__file__),'index.html')
	if urlPath is not None:
		if len(urlPath) < 2:
			alpha = urlPath
		else:
			category = urlPath
	keyCodes = getKeyCodes(self)
	args = dict(timestamp=timestamp,alpha=alpha,category=category,content=content,common=common,categories=categories,aToZList=json.dumps(AToZList),keyCodes=keyCodes)
	self.response.out.write(template.render(path,args))
  def post(self, urlPath):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    args = dict(urlPath=urlPath)
    self.response.out.write(template.render(path,args))

class Error404Handler(webapp.RequestHandler):
  def get(self, urlPath):
	self.error(404)
	timestamp = time.time()
	args = dict(timestamp=timestamp,content=content,common=common,categories=categories)
	path = os.path.join(os.path.dirname(__file__),'error.html')
	self.response.out.write(template.render(path,args))
	
def main():
  util.run_wsgi_app(webapp.WSGIApplication([
	('/',HomeHandler),
	(regexpURLAtoZ,ViewHandler),
	(regexpURLError,Error404Handler)
  ]))

if __name__ == '__main__':
  main()
