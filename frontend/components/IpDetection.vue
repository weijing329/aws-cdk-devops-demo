<template>

  <div v-if="ip">
    <div class="box" style="border:1px solid #726d6f;margin-top:14px;padding:5px;background-color:#f3f9f2;">
      <div style="text-align:center;color:#000;font-weight:bold;">Your IP Information:</div>
      <div style="align:center;padding:5px 10px 5px 10px;">
        <hr style="color: #b4b7b4;background-color: #b4b7b4;height:1px;">
      </div>
      <table style="padding-top:10px;border-spacing:0px;border-collapse: collapse;">
        <tbody>
          <tr><th class="right" style="font-weight:bold;color:#676769;">IPv4:</th><td class="left" style="font-size:14px;">{{ ip }}</td></tr>
          <template v-if="ipapi">
            <tr><th class="right" style="font-weight:bold;color:#676769;">ISP:</th><td class="left" style="font-size:14px;">{{ ipapi.isp }}</td></tr>
            <tr><th class="right" style="font-weight:bold;color:#676769;">City:</th><td class="left" style="font-size:14px;">{{ ipapi.city }}</td></tr>
            <tr><th class="right" style="font-weight:bold;color:#676769;">Country:</th><td class="left" style="font-size:14px;">{{ ipapi.country }}</td></tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script>
export default {
  mounted () {
      this.fetchIpInfo();
  },
  computed: {
    ip () { return this.$store.state.ipInfo.sourceIp },
    ipapi () { return this.$store.state.ipInfo.ipapi },
    ipstack () { return this.$store.state.ipInfo.ipstack }
  },
  methods: {
    async fetchIpInfo() {
      this.$store.dispatch('fetchIpInfo')
    }
  }
}
</script>

<style scoped>
.box {
  margin: auto;
  width: 300px;
}
.left {
  text-align: left;
  padding: 7px;
}
.right {
  text-align: right;
}
</style>
