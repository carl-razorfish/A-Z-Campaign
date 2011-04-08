from ConfigParser import ConfigParser
import logging
from google.appengine.api import memcache

memcache.flush_all()

class AToZProperties(object):
	def load(self):
		content = memcache.get("atozproperties")
		if content is not None:
			logging.info("Got atozproperties from memcache")
			return content
		else:
			logging.info("NOT Got atozproperties from memcache")
			atozCopyProperties = "properties/atoz.properties"
			atozCfg = ConfigParser()
			atozCfg.read(atozCopyProperties)
			content = list()
			sections = sorted(atozCfg.sections())
			for i in sections:
				section = {}
				section["section"] = i;
				for j in atozCfg.items(i):
					section[j[0]] = j[1]
				content.append(section)
			memcache.add("atozproperties", content)
			return content
			
class AToZList(object):
	def load(self):
		sections = memcache.get("atozlist")
		if sections is not None:
			logging.info("Got atozlist from memcache")
			return sections
		else:
			logging.info("NOT Got atozlist from memcache")
			atozCopyProperties = "properties/atoz.properties"
			atozCfg = ConfigParser()
			atozCfg.read(atozCopyProperties)
			sections = sorted(atozCfg.sections())
			memcache.add("atozlist", sections)
			return sections
						
class CommonProperties(object):
	def load(self):
		content = memcache.get("commonproperties")
		if content is not None:
			logging.info("Got commonproperties from memcache")
			return content
		else:
			commonCopyProperties = "properties/common.properties"
			commonCfg = ConfigParser()
			commonCfg.read(commonCopyProperties)
			content = {}
			sections = sorted(commonCfg.sections())
			for i in sections:
				content["section"] = i;
				for j in commonCfg.items(i):
					content[j[0]] = j[1]				
			memcache.add("commonproperties", content)
			return content
		
class CategoryProperties(object):
	def load(self):
		content = memcache.get("categoryproperties")
		if content is not None:
			logging.info("Got categoryproperties from memcache")
			return content
		else:
			categoryCopyProperties = "properties/category.properties"
			categoryCfg = ConfigParser()
			categoryCfg.read(categoryCopyProperties)
			content = {}
			for i in categoryCfg.items("Categories"):
				content[i[0]] = i[1]
			memcache.add("categoryproperties", content)
			return content