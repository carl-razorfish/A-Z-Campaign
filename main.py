#!/usr/bin/env python
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
from google.appengine.dist import use_library
use_library('django', '1.2')

import hashlib
import logging
import wsgiref.handlers
import simplejson as json
import time

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from google.appengine.api import memcache
from properties.setproperties import AToZProperties
from properties.setproperties import CommonProperties
from properties.setproperties import ConfigProperties
from random import choice

common = CommonProperties()
content = AToZProperties()
config = ConfigProperties()

regexpURLAtoZ = r"/([a-z]{1})"
regexpURLError = r"/(.*)"

CDNPrefix = "http://a-z-campaign-"
CDNSuffix = ".appspot.com/"
CDNSlaves = ["master"]

def getCDN(self):
	"""
	Generate a GAE URL as a CDN, for static file requests
	"""
	self.cdn = CDNPrefix + choice(CDNSlaves) + CDNSuffix
	return self.cdn

class OverQuotaHandler(webapp.RequestHandler):
  def get(self):
	path = os.path.join(os.path.dirname(__file__),'over_quota.html')
	self.response.out.write(template.render(path,{}))	
	
class UnavailableHandler(webapp.RequestHandler):
  def get(self):
	path = os.path.join(os.path.dirname(__file__),'unavailable.html')
	self.response.out.write(template.render(path,{}))		
	
class HomeHandler(webapp.RequestHandler):
  def get(self):
	contentMC = content.load()
	commonMC = common.load()
	configMC = config.load()
	path = os.path.join(os.path.dirname(__file__),'index.py.html')
	args = dict(content=contentMC,common=commonMC,config=configMC)
	self.response.out.write(template.render(path,args))
  def post(self):
    path = os.path.join(os.path.dirname(__file__),'index.py.html')
    self.response.out.write(template.render(path,{}))

		
class ViewHandler(webapp.RequestHandler):
  def get(self, urlPath):
	contentMC = content.load()
	commonMC = common.load()
	configMC = config.load()
	alpha = ""
	if urlPath is not None:
		if len(urlPath) < 2:
			alpha = urlPath
		else:
			category = urlPath
	path = os.path.join(os.path.dirname(__file__),'index.py.html')
	args = dict(alpha=alpha,content=contentMC,common=commonMC,config=configMC)
	self.response.out.write(template.render(path,args))
  def post(self, urlPath):
    path = os.path.join(os.path.dirname(__file__),'index.py.html')
    args = dict(urlPath=urlPath)
    self.response.out.write(template.render(path,args))

class Error404Handler(webapp.RequestHandler):
  def get(self, urlPath):
	self.error(404)
	contentMC = content.load()
	commonMC = common.load()
	timestamp = time.time()
	args = dict(timestamp=timestamp,content=contentMC,common=commonMC)
	path = os.path.join(os.path.dirname(__file__),'error.html')
	self.response.out.write(template.render(path,args))

class ForceErrorHandler(webapp.RequestHandler):
  def get(self):
	contentMC = content.load()
	commonMC = common.load()
	configMC = config.load()
	args = dict(content=contentMC,common=commonMC,config=configMC)
	path = os.path.join(os.path.dirname(__file__),'error.html')
	self.response.out.write(template.render(path,args))		

def real_main():
  util.run_wsgi_app(webapp.WSGIApplication([
	('/error',ForceErrorHandler),
	('/over-quota',OverQuotaHandler),
	('/',HomeHandler),
	(regexpURLAtoZ,ViewHandler),
	(regexpURLError,Error404Handler)
  ]))

""" - ap unavailable setup 
def real_main():
  util.run_wsgi_app(webapp.WSGIApplication([
	("/.*",UnavailableHandler)
  ]))
"""
def profile_main():
    # This is the main function for profiling
    # We've renamed our original main() above to real_main()
    import cProfile, pstats
    prof = cProfile.Profile()
    prof = prof.runctx("real_main()", globals(), locals())
    print "<pre>"
    stats = pstats.Stats(prof)
    stats.sort_stats("time")  # Or cumulative
    stats.print_stats(80)  # 80 = how many to print
    # The rest is optional.
    stats.print_callees()
    stats.print_callers()
    print "</pre>"

if __name__ == '__main__':
  real_main()
