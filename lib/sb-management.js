const StoryblokClient = require('storyblok-js-client')
const axios = require('axios')

class StoryblokManagementQueries {
  constructor (ctx) {
    this.ctx = ctx
    this.client = new StoryblokClient({
      oauthToken: '<%= options.oAuthToken %>'
    })
    this.spaceId = '<%= options.spaceId %>'
    // this.postTypes = {
    //   posts: "<%= options.postTypes.posts %>" || "posts",
    // };
  }

  // createPost(options = {}, publish = { publish: 1 }) {
  //   this.createStory(this.postTypes.posts, options, publish);
  // }

  async createStory (payload = {}, publish = 1) {
    const options = { story: payload }
    if (publish === 1) {
      options.publish = publish
    }
    return await this._createData({ options })
  }

  async _createData ({ datatype = 'stories', options = {} }) {
    return await this.client.post(
      `spaces/${this.spaceId}/${datatype}/`,
      options
    )
  }

  async prepareContainer (payload) {
    // return await this.client.post(`spaces/${this.spaceId}/assets/`, payload);
    return await this._createData({ datatype: 'assets', options: payload })
  }

  async assetUpload (file, uploadContainer) {
    const formData = new FormData()
    for (const key in uploadContainer.data.fields) {
      formData.append(key, uploadContainer.data.fields[key])
    }
    formData.append('file', file)

    return await axios.post(uploadContainer.data.post_url, formData)
  }

  async assetDelete (assetId) {
    return await this.client.delete(`spaces/${this.spaceId}/assets/${assetId}`)
  }
}

export default (ctx, inject) => {
  const storyblokManagementAPI = new StoryblokManagementQueries(ctx)

  ctx.$sbManagement = storyblokManagementAPI

  inject('sbManagement', storyblokManagementAPI)
}
