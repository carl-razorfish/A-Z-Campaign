from ConfigParser import ConfigParser

atozCopyProperties = "properties/atoz.properties"
atoz = ConfigParser()
atoz.read(atozCopyProperties)

class CopyProperties(object):
	def load(self):
		self.app = {}
		self.app["header"] = atoz.get("App", "header")
		self.a = {}
		self.a["header"] = atoz.get("A", "header")
		self.b = {}
		self.b["header"] = atoz.get("B", "header")
		return self