const StoryblokClient = require("storyblok-js-client");
const axios = require("axios");

class StoryblokManagementQueries {
  constructor(ctx) {
    this.ctx = ctx;
    this.client = new StoryblokClient({
      oauthToken: "<%= options.oAuthToken %>",
    });
    this.spaceId = "<%= options.spaceId %>";
  }

  createStory(options = {}) {
    this._createData({ options });
  }

  _createData({ datatype = "stories", path = "", spaceId = "", options = {} }) {
    const spaceId = spaceId || this.spaceId;
    return this.$sbManagement.client
      .post(`spaces/${spaceId}/stories/`, options)
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
