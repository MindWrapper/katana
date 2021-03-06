# This file is part of Buildbot.  Buildbot is free software: you can
# redistribute it and/or modify it under the terms of the GNU General Public
# License as published by the Free Software Foundation, version 2.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
# details.
#
# You should have received a copy of the GNU General Public License along with
# this program; if not, write to the Free Software Foundation, Inc., 51
# Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
#
# Copyright Buildbot Team Members
from buildbot.status.web.jsontestresults import JSONTestResource

from buildbot.status.buildstep import BuildStepStatus
from buildbot.status.build import BuildStatus
from buildbot.status.logfile import HTMLLogFile, LogFile
from buildbot.status.web.logs import LogsResource, HTMLLog, TextLog

import mock
from buildbot.status.web.xmltestresults import XMLTestResource
from twisted.trial import unittest
from twisted.web.resource import NoResource


class TestLogsResource(unittest.TestCase):
    def setupStatus(self, name=None, text=None, has_content=False, content_type=None, html_log=True):
        st = self.build_step_status = mock.Mock(BuildStepStatus)
        self.logs = []
        st.getLogs = lambda: self.logs

        if name is None:
            return st

        step = self.setupBuildStepStatus()
        log = HTMLLogFile(step, "example", "test file", "test html") if html_log \
            else LogFile(step, "example", "test file")
        log.getName = lambda: name
        log.hasContents = lambda: has_content
        log.content_type = content_type
        log.getText = lambda: text
        self.logs.append(log)

        return st

    def setupBuildStepStatus(self):
        step = mock.Mock(BuildStepStatus)
        step.build = mock.Mock(BuildStatus)
        builder = mock.Mock()
        builder.basedir = "dir"
        step.build.builder = builder
        step.build.builder.master = mock.Mock()
        return step

    def test_log_resource_json(self):
        st = self.setupStatus("test", "", True, "json")
        logs_resource = LogsResource(st)
        res = logs_resource.getChild("test", "")

        self.assertIsInstance(res, JSONTestResource)

    def test_log_resource_xml(self):
        logs_resource = LogsResource(self.setupStatus("test", "", True, "xml"))
        res = logs_resource.getChild("test", "")

        self.assertIsInstance(res, XMLTestResource)

    def test_log_resource_xml_no_content_type(self):
        logs_resource = LogsResource(self.setupStatus("test", "nosetests", True))
        res = logs_resource.getChild("test", "")

        self.assertIsInstance(res, XMLTestResource)

    def test_log_resource_xml_content(self):
        logs_resource = LogsResource(self.setupStatus("test", "<..><xml-stylesheet..!", True))
        res = logs_resource.getChild("test", "")

        self.assertIsInstance(res, XMLTestResource)

    def test_log_resource_xml_notests_in_content(self):
        logs_resource = LogsResource(self.setupStatus("test", "dfsd _nosetests", True))
        res = logs_resource.getChild("test", "")

        self.assertIsInstance(res, XMLTestResource)

    def test_log_resource_default(self):
        logs_resource = LogsResource(self.setupStatus("test", "", True))
        res = logs_resource.getChild("test", "")

        self.assertIsInstance(res, HTMLLog)

    def test_log_resource_no_log(self):
        logs_resource = LogsResource(self.setupStatus("test", "", True))
        res = logs_resource.getChild("test1", "")

        self.assertIsInstance(res, NoResource)

    def test_log_resource_no_html_log_file(self):
        logs_resource = LogsResource(self.setupStatus("test", "test content", True, html_log=False))
        res = logs_resource.getChild("test", "")

        self.assertIsInstance(res, TextLog)

    def test_log_resource_no_logs(self):
        logs_resource = LogsResource(self.setupStatus())
        res = logs_resource.getChild("test1", "")

        self.assertIsInstance(res, NoResource)

    def test_log_initialize_attribute(self):
        step = self.setupBuildStepStatus()
        htmllog = HTMLLogFile(step, "example", "test file", "test html")

        self.assertEquals(htmllog.content_type, "")
