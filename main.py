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

class HomeHandler(webapp.RequestHandler):
  def get(self):
	path = os.path.join(os.path.dirname(__file__),'index.html')
	logging.info(self.request)
	hashTag=""
	args = dict(hashTag=hashTag)
	self.response.out.write(template.render(path,args))
  def post(self):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    hashTag=""
    args = dict(hashTag=hashTag)
    self.response.out.write(template.render(path,args))

class PeopleHandler(webapp.RequestHandler):
  def get(self):
	path = os.path.join(os.path.dirname(__file__),'index.html')
	logging.info(self.request)
	hashTag="people"
	args = dict(hashTag=hashTag)
	self.response.out.write(template.render(path,args))
  def post(self):
    path = os.path.join(os.path.dirname(__file__),'index.html')
    hashTag="people"
    args = dict(hashTag=hashTag)
    self.response.out.write(template.render(path,args))

def main():
  util.run_wsgi_app(webapp.WSGIApplication([
    ('/',HomeHandler),
    ('/#people',PeopleHandler)
  ]))

if __name__ == '__main__':
  main()
