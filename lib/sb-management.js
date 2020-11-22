const StoryblokClient = require("storyblok-js-client");
const axios = require("axios");

class StoryblokManagementQueries {
  constructor(ctx) {
    this.ctx = ctx;
    this.client = new StoryblokClient({
      oauthToken: "<%= options.oAuthToken %>",
    });
    this.spaceId = "<%= options.spaceId %>";
    this.postTypes = {
      posts: "<%= options.postTypes.posts %>" || "posts",
    };
  }

  createPost(options = {}, publish = { publish: 1 }) {
    this.createStory(this.postTypes.posts, options, publish);
  }

  createStory(component = "", options = {}, publish = { publish: 1 }) {
    this._createData({ component, options, publish });
  }

  _createData({ datatype = "stories", spaceId = "", options = {}, publish }) {
    const spaceId = spaceId || this.spaceId;
    return this.$sbManagement.client
      .post(`spaces/${spaceId}/${datatype}/`, options, publish)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async assetUpload(fileblob, payload, success, failure) {
    const spaceId = payload.spaceId || this.spaceId;
    await this.client
      .post(`spaces/${spaceId}/assets/`, payload)
      .then(async (response) => {
        let formData = new FormData();
        for (let key in response.data.fields) {
          formData.append(key, response.data.fields[key]);
        }
        formData.append("file", fileblob);
        await axios
          .post(response.data.post_url, formData)
          .then((res) => {
            success(response.data);
          })
          .catch((error) => {
            failure(error);
          });
      })
      .catch((error) => {
        failure(error);
      });
  }
}

export default (ctx, inject) => {
  const storyblokManagementAPI = new StoryblokManagementQueries(ctx);

  ctx.$sbManagement = storyblokManagementAPI;

  inject("sbManagement", storyblokManagementAPI);
};
