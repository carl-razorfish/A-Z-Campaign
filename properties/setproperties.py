from ConfigParser import ConfigParser
import logging

atozCopyProperties = "properties/atoz.properties"
atoz = ConfigParser()
atoz.read(atozCopyProperties)

commonCopyProperties = "properties/common.properties"
common = ConfigParser()
common.read(commonCopyProperties)

class AToZProperties(object):
	def load(self):
		content = {}
		sections = sorted(atoz.sections())
		for i in sections:
			content[i] = {}
			for j in atoz.items(i):
				content[i][j[0]] = j[1]
				logging.info(content[i])
		return content

class CommonProperties(object):
	def load(self):
		content = {}
		sections = sorted(common.sections())
		for i in sections:
			content[i] = {}
			for j in common.items(i):
				content[i][j[0]] = j[1]
				logging.info(content[i])
		return content