#!/usr/bin/env python3
# -*- coding:utf-8 -*-
"""pip setup config."""

#############################################
# File Name: setup.py
# Author: DeppDialog
# Mail: thebotbot@sina.com
# Created Time: 2019-06-10
#############################################

import os
from setuptools import setup, find_packages

INSTALL_REQUIRES = [x.strip() for x in open(os.path.join(
    os.path.realpath(os.path.dirname(__file__)),
    'requirements.txt'
)).read().split('\n') if len(x.strip())]

VERSION = os.path.join(
    os.path.realpath(os.path.dirname(__file__)),
    'waas_client',
    'version.txt'
)

setup(
    name='waas-client',
    version=open(VERSION, 'r').read().strip(),
    keywords=('Wechaty',),
    description='WAAS Client',
    long_description='Wechaty-As-A-Service Client',
    license='Private',
    url='https://github.com/deepdialog/wechaty-as-a-service',
    author='deepdialog',
    author_email='thebotbot@sina.com',
    packages=find_packages(),
    include_package_data=True,
    platforms='any',
    install_requires=INSTALL_REQUIRES
)
