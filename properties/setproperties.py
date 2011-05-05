from ConfigParser import ConfigParser
import logging
import re
from google.appengine.api import memcache

# TODO: remove the memcache flush
memcache.flush_all()

class AToZProperties(object):
	def load(self):
		content = memcache.get("atozproperties")
		if content is not None:
			#logging.info("Got atozproperties from memcache")
			return content
		else:
			#logging.info("NOT Got atozproperties from memcache")
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
	"""
	Create an Object with keys as Category items, and values as an Array of A to Z items within that Category
	"""
	def load(self):
		atozlist = memcache.get("atozlistproperties")
		if atozlist is not None:
			#logging.info("Got atozlistproperties from memcache")
			return atozlist
		else:
			#logging.info("NOT Got atozlistproperties from memcache")
			# Get Categories
			categoryCopyProperties = "properties/category.properties"
			categoryCfg = ConfigParser()
			categoryCfg.read(categoryCopyProperties)
			
			# Get A to Z list
			atozCopyProperties = "properties/atoz.properties"
			atozCfg = ConfigParser()
			atozCfg.read(atozCopyProperties)
			atozsections = sorted(atozCfg.sections())
			
			atozlist = dict()
			for i in categoryCfg.items("Categories"):
				section = list()
				atozlist[i[0]] = section
				
				for j in atozsections:
					for k in atozCfg.items(j):
						if "category_tags" in k[0]:
							m = re.search(i[0], k[1])
							if m is not None:
								section.append(""+j)
			memcache.add("atozlistproperties", atozlist)
			return atozlist
								
class CommonProperties(object):
	def load(self):
		content = memcache.get("commonproperties")
		if content is not None:
			#logging.info("Got commonproperties from memcache")
			return content
		else:
			#logging.info("NOT Got commonproperties from memcache")
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
			#logging.info("Got categoryproperties from memcache")
			return content
		else:
			#logging.info("NOT Got categoryproperties from memcache")
			categoryCopyProperties = "properties/category.properties"
			categoryCfg = ConfigParser()
			categoryCfg.read(categoryCopyProperties)
			content = {}
			for i in categoryCfg.items("Categories"):
				content[i[0]] = i[1]
			memcache.add("categoryproperties", content)
			return content