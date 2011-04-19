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

class HomeHandler(webapp.RequestHandler):
  def get(self):
	try:
		atozlistMC = AToZList.load()
		categoriesMC = categories.load()
		contentMC = content.load()
		commonMC = common.load()
		keyCodes = getKeyCodes(self)
		path = os.path.join(os.path.dirname(__file__),'index.html')
		args = dict(content=contentMC,common=commonMC,categories=categoriesMC,aToZList=json.dumps(atozlistMC),keyCodes=keyCodes)
		self.response.out.write(template.render(path,args))
	except apiproxy_errors.OverQuotaError, message:
		logging.error(message)
		mail.send_mail(sender="Razorfish RIA Team London (automated) <razorfish.ria.london@gmail.com>", to="Stuart Thorne <stuart.thorne@razorfish.com>", subject="URGENT : OverQuotaError(HomeHandler) : http://a-z-campaign.appspot.com", body="""The Google App engine web application at http://a-z-campaign.appspot.com has exceeded it's daily Request Quota. Check the Error logs for more details.""")
  def post(self):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    self.response.out.write(template.render(path,{}))

		
class ViewHandler(webapp.RequestHandler):
  def get(self, urlPath):
	try:
		atozlistMC = AToZList.load()
		categoriesMC = categories.load()
		contentMC = content.load()
		commonMC = common.load()
		alpha = ""
		category = ""
		path = os.path.join(os.path.dirname(__file__),'index.html')
		if urlPath is not None:
			if len(urlPath) < 2:
				alpha = urlPath
			else:
				category = urlPath
		keyCodes = getKeyCodes(self)
		args = dict(alpha=alpha,category=category,content=contentMC,common=commonMC,categories=categoriesMC,aToZList=json.dumps(atozlistMC),keyCodes=keyCodes)
		self.response.out.write(template.render(path,args))
	except apiproxy_errors.OverQuotaError, message:
		logging.error(message)
		mail.send_mail(sender="Razorfish RIA Team London (automated) <razorfish.ria.london@gmail.com>", to="Stuart Thorne <stuart.thorne@razorfish.com>", subject="URGENT : OverQuotaError(ViewHandler) : http://a-z-campaign.appspot.com", body="""The Google App engine web application at http://a-z-campaign.appspot.com has exceeded it's daily Request Quota. Check the Error logs for more details.""")
  def post(self, urlPath):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    args = dict(urlPath=urlPath)
    self.response.out.write(template.render(path,args))

class Error404Handler(webapp.RequestHandler):
  def get(self, urlPath):
	try:
		self.error(404)
		categoriesMC = categories.load()
		contentMC = content.load()
		commonMC = common.load()
		timestamp = time.time()
		args = dict(timestamp=timestamp,content=contentMC,common=commonMC,categories=categoriesMC)
		path = os.path.join(os.path.dirname(__file__),'error.html')
		self.response.out.write(template.render(path,args))
	except apiproxy_errors.OverQuotaError, message:
		logging.error(message)
		mail.send_mail(sender="Razorfish RIA Team London (automated) <razorfish.ria.london@gmail.com>", to="Stuart Thorne <stuart.thorne@razorfish.com>", subject="URGENT : OverQuotaError(Error404Handler) : http://a-z-campaign.appspot.com", body="""The Google App engine web application at http://a-z-campaign.appspot.com has exceeded it's daily Request Quota. Check the Error logs for more details.""")
	
def real_main():
  util.run_wsgi_app(webapp.WSGIApplication([
	('/',HomeHandler),
	(regexpURLAtoZ,ViewHandler),
	(regexpURLError,Error404Handler)
  ]))

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
