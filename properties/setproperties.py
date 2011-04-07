from ConfigParser import ConfigParser
import logging
from google.appengine.api import memcache

atozCopyProperties = "properties/atoz.properties"
atozCfg = ConfigParser()

commonCopyProperties = "properties/common.properties"
commonCfg = ConfigParser()

categoryCopyProperties = "properties/category.properties"
categoryCfg = ConfigParser()

class AToZProperties(object):
	def load(self):
		content = memcache.get("atozproperties")
		if content is not None:
			logging.info("Got atozproperties from memcache")
			return content
		else:
			atozCfg.read(atozCopyProperties)
			content = {}
			sections = sorted(atozCfg.sections())
			for i in sections:
				content[i] = {}
				for j in atozCfg.items(i):
					content[i][j[0]] = j[1]
			memcache.add("atozproperties", content)
			return content

class CommonProperties(object):
	def load(self):
		content = memcache.get("commonproperties")
		if content is not None:
			logging.info("Got commonproperties from memcache")
			return content
		else:
			commonCfg.read(commonCopyProperties)
			content = {}
			sections = sorted(commonCfg.sections())
			for i in sections:
				content[i] = {}
				for j in commonCfg.items(i):
					content[i][j[0]] = j[1]
			memcache.add("commonproperties", content)
			return content
		
class CategoryProperties(object):
	def load(self):
		content = memcache.get("categoryproperties")
		if content is not None:
			logging.info("Got categoryproperties from memcache")
			return content
		else:
			categoryCfg.read(categoryCopyProperties)
			content = {}
			for i in categoryCfg.items("Categories"):
				content[i[0]] = i[1]
			memcache.add("categoryproperties", content)
			return content