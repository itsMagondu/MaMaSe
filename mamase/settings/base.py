"""

Django settings for mamase project.

Generated by 'django-admin startproject' using Django 1.8.3.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from urlparse import urlparse

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_DIR = os.path.dirname(PROJECT_DIR)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/


# Application definition

AUTH_USER_MODEL = 'auth.User'

INSTALLED_APPS = (
   'django.contrib.admin',
   'django.contrib.sites',
   'django.contrib.auth',
   'django.contrib.contenttypes',
   'django.contrib.sessions',
   'django.contrib.messages',
   'django.contrib.staticfiles',
   
   'taggit',
   'compressor',
   'modelcluster',
   
   'wagtail.wagtailcore',
   'wagtail.wagtailadmin',
   'wagtail.wagtailsearch',
   'wagtail.wagtailimages',
   'wagtail.wagtaildocs',
   'wagtail.wagtailsnippets',
   'wagtail.wagtailusers',
   'wagtail.wagtailsites',
   'wagtail.wagtailembeds',
   'wagtail.wagtailredirects',
   'wagtail.wagtailforms',
   
   'jsonfield',
   'elasticsearch',
   'search',
   'home',
   'disqus',
   'djangobower',
   'filer',
   'mptt',
   'easy_thumbnails',
   'storages',

   'apps.utils',
   'apps.galleryapp',
   'apps.gallery',
   'apps.video',
   'apps.event',
   'apps.news',
   'apps.quiz',
   'apps.mamasemedia',
   'apps.true_false',
   'apps.multichoice',
   'apps.essay',
   'apps.partners',
   'apps.testapp',
   'apps.intro',
   'apps.gis',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',

    'wagtail.wagtailcore.middleware.SiteMiddleware',
    'wagtail.wagtailredirects.middleware.RedirectMiddleware',
)

ROOT_URLCONF = 'mamase.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(PROJECT_DIR, 'templates'),
            os.path.join(BASE_DIR, 'templates'),
            os.path.join(PROJECT_DIR, 'templates', 'site_pages'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'mamase.context_processor.baseurl',
                'mamase.context_processor.news_items',
            ],
        },
    },
]

WSGI_APPLICATION = 'mamase.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
    'djangobower.finders.BowerFinder',
)

STATICFILES_DIRS = (
    os.path.join(PROJECT_DIR, 'static'),
)

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = '/static/'


# Wagtail settings

WAGTAIL_SITE_NAME = "mamase"


REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,                                                                                                    
    # or allow read-only access for unauthenticated users.                                                                                                                                     
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}

DISQUS_API_KEY = 'xhv95xoheLTkiaS7PKaZmxe9NpTObz4LDUsNmC2e1XNgW2SKIO0bLSqfwIRWrzz4'
DISQUS_WEBSITE_SHORTNAME = 'Upande'

SITE_ID = 1

BOWER_COMPONENTS_ROOT = os.path.join(BASE_DIR, 'components')

BOWER_INSTALLED_APPS = (
    'jquery',
    'bootstrap'
)

ALLOWED_HOSTS = ['*']

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_PORT = 587

#For gmail or google apps
EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = 'mamasewebsite@gmail.com'
SERVER_EMAIL = 'mamasewebsite@gmail.com'

FIXTURE_DIRS = (
   'apps/news/fixures/',
   'apps/videos/fixures/',
   'apps/utils/fixures/',
   'apps/testapp/fixures/',
)

LOGGING = {
   'version': 1,
   'disable_existing_loggers': False,
   'formatters': {
        'verbose': {
            'format': ('%(asctime)s [%(process)d] [%(levelname)s] ' +
                       'pathname=%(pathname)s lineno=%(lineno)s ' +
                       'funcname=%(funcName)s %(message)s'),
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        }
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'testlogger': {
            'handlers': ['console'],
            'level': 'INFO',
        }
    }
}
