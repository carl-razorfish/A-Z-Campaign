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
from properties.setproperties import CopyProperties

class HomeHandler(webapp.RequestHandler):
  def get(self, urlPath):
	path = os.path.join(os.path.dirname(__file__),'index.html')
	copy = CopyProperties()
	load = copy.load()
	args = dict(urlPath=urlPath,copy=load)
	self.response.out.write(template.render(path,args))
  def post(self, urlPath):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    args = dict(urlPath=urlPath)
    self.response.out.write(template.render(path,args))

class AdminHandler(webapp.RequestHandler):
  def get(self):
	path = os.path.join(os.path.dirname(__file__),'admin.html')
	self.response.out.write(template.render(path,{}))
  def post(self, urlPath):
    path = os.path.join(os.path.dirname(__file__),'admin.html')
    self.response.out.write(template.render(path,{}))

def main():
  util.run_wsgi_app(webapp.WSGIApplication([
	('/admin',AdminHandler),
	(r'/(.*)',HomeHandler)
  ]))

if __name__ == '__main__':
  main()
