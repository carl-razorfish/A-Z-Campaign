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
from google.appengine.api import mail

common = CommonProperties()
content = AToZProperties()
categories = CategoryProperties()
AToZList = AToZList()



regexpURLAtoZ = r"/(food|people|planet|community|london2012|[a-z]{1})"
regexpURLError = r"/(.*)"


def getKeyCodes(self):
	"""
	Generate JavaScript numeric keyCodes for Categories
	Note that the categories must be returned from the ConfigParser pre-sorted into the correct order, or the keyCode reference and keyboared number will be out of sync
	"""
	counter = 49
	self._keyCodes = dict()
	categoriesMC = categories.load()
	for cat in categoriesMC:
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
	atozlistMC = AToZList.load()
	categoriesMC = categories.load()
	contentMC = content.load()
	commonMC = common.load()
	
	#mail.send_mail(sender="Razorfish RIA Team London (automated) <razorfish.ria.london@gmail.com>", to="Stuart Thorne <stuart.thorne@razorfish.com>", subject="Test email from GAE", body="""This is a test email from Google App Engine.""")

	keyCodes = getKeyCodes(self)
	path = os.path.join(os.path.dirname(__file__),'index.html')
	args = dict(timestamp=timestamp,content=contentMC,common=commonMC,categories=categoriesMC,aToZList=json.dumps(atozlistMC),keyCodes=keyCodes)
	self.response.out.write(template.render(path,args))
  def post(self):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    self.response.out.write(template.render(path,{}))

		
class ViewHandler(BaseHandler):
  def get(self, urlPath):
	atozlistMC = AToZList.load()
	categoriesMC = categories.load()
	contentMC = content.load()
	commonMC = common.load()
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
	args = dict(timestamp=timestamp,alpha=alpha,category=category,content=contentMC,common=commonMC,categories=categoriesMC,aToZList=json.dumps(atozlistMC),keyCodes=keyCodes)
	self.response.out.write(template.render(path,args))
  def post(self, urlPath):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    args = dict(urlPath=urlPath)
    self.response.out.write(template.render(path,args))

class Error404Handler(webapp.RequestHandler):
  def get(self, urlPath):
	self.error(404)
	categoriesMC = categories.load()
	contentMC = content.load()
	commonMC = common.load()
	timestamp = time.time()
	args = dict(timestamp=timestamp,content=contentMC,common=commonMC,categories=categoriesMC)
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
