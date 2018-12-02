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
    const ipInfo = await this.$axios.$get(
      'https://api.weijing329.studio/demo/ip'
    )
    commit('setIpInfo', ipInfo)
  },
}
