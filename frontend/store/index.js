const urljoin = require('url-join')

export const state = () => ({
  ipInfo: {},
})

export const mutations = {
  setIpInfo(state, ipInfo) {
    state.ipInfo = ipInfo
  },
}

export const actions = {
  async fetchIpInfo({ commit }) {
    const apiURL = urljoin(process.env.apiBaseUrl, '/ip')
    const ipInfo = await this.$axios.$get(apiURL)
    commit('setIpInfo', ipInfo)
  },
}
