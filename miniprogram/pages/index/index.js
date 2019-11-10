//index.js
const app = getApp()

Page({
  data: {
    pageCur: 'home'
  },

  NavChange(e) {
    this.setData({
      pageCur: e.currentTarget.dataset.cur
    })
  },

  scan: function() {
    console.log('scan...');
  },

  onLoad: function() {},


})