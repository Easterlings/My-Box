// pages/myCollection/myCollection.js
const db = wx.cloud.database()
const collection = db.collection('users');
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musics:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    collection.where({
      _openid: app.globalData.openid,
    }).get({
      success(res) {
        if (res.data != null) {
          var musics=[]
          var len=res.data.length
          for(var i=0;i<len;i++)
          {
            var temp={
              musicId:res.data[i].songId,
              author:res.data[i].author,
              title:res.data[i].title,
              coverageUrl:res.data[i].coverageUrl
            }
            musics.push(temp)
          }
          that.setData({
            musics:musics
          })
        }
      }
    })
  },
  onMusicTap: function (event) {
    var musicId = event.currentTarget.dataset.musicId
    var coverageUrl = event.currentTarget.dataset.coverageUrl
    wx.navigateTo({
      url: "../music/music-play/music-play?id=" + musicId + "&coverageUrl=" + coverageUrl,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    collection.where({
      _openid: app.globalData.openid,
    }).get({
      success(res) {
        if (res.data != null) {
          var musics = []
          var len = res.data.length
          for (var i = 0; i < len; i++) {
            var temp = {
              musicId: res.data[i].songId,
              author: res.data[i].author,
              title: res.data[i].title,
              coverageUrl: res.data[i].coverageUrl
            }
            musics.push(temp)
          }
          that.setData({
            musics: musics
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})