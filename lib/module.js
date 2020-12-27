const { resolve } = require('path')
const StoryblokClient = require('storyblok-js-client')
const logger = require('./logger')

export default async function storyblokQueryModule (moduleOptions) {
  const defaultOptions = {
    accessToken: '',
    version: 'published',
    defaultLanguage: '',
    cacheProvider: 'memory'
  }

  const options = Object.assign(
    defaultOptions,
    this.options.storyblok,
    this.options.storyblokQueries,
    moduleOptions
  )

  // Check if accessToken is defined
  if (!options.accessToken) {
    logger.warn("No 'accessToken' found in module options")
    return
  }

  const client = new StoryblokClient({
    accessToken: options.accessToken
  })

  const { data: spaceData } = await client.get('cdn/spaces/me')

  const { language_codes: languageCodes = [] } = spaceData.space
  if (languageCodes.length) {
    // Check if defaultLanguage is defined
    if (!options.defaultLanguage) {
      logger.warn('No Default Language found in Module Options')
      return
    }

    languageCodes.unshift(options.defaultLanguage)
    options.languages = languageCodes
  }

  this.addPlugin({
    src: resolve(__dirname, 'sb-client.js'),
    options
  })

  if (!options.disableManagementApi) {
    if (options.oAuthToken && options.spaceId) {
      logger.info('Storyblok Management API enabled')
      this.addPlugin({
        src: resolve(__dirname, 'sb-management.js'),
        options: {
          ...options,
          postTypes: options.postTypes || {}
        }
      })
    } else {
      logger.warn("No 'oauthToken' and 'spaceId' found in module options")
    }
  } else {
    logger.info('Storyblok Management API disabled')
  }
}

module.exports.meta = require('../package.json')
