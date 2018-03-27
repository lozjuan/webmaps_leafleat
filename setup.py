from setuptools import setup

setup(name='World Bank Indicators Mapper',
      version='1.0',
      description='Mapping World Bank Indicators',
      author='JuanTanamo',
      author_email='lozjuan@gmail.com',
      url='http://www.python.org/sigs/distutils-sig/',
      install_requires=['Flask', 'requests', 'geojson', 'pandas'],
      )
