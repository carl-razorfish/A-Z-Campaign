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

class ConfigProperties(object):
	def load(self):
		config = memcache.get("configproperties")
		if config is not None:
			#logging.info("Got commonproperties from memcache")
			return config
		else:
			#logging.info("NOT Got commonproperties from memcache")
			configCopyProperties = "properties/config.properties"
			configCfg = ConfigParser()
			configCfg.read(configCopyProperties)
			config = {}
			sections = sorted(configCfg.sections())
			for i in sections:
				config["section"] = i;
				for j in configCfg.items(i):
					config[j[0]] = j[1]				
			memcache.add("configproperties", config)
			return config