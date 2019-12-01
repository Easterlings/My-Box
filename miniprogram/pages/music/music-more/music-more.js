// pages/music/music-more/music-more.js
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
    var category = options.category
    var dataUrl = "http://tingapi.ting.baidu.com/v1/restserver/ting?"
    switch (category) {
      case "新歌榜":
        dataUrl = dataUrl + "type=1"
        break
      case "热歌榜":
        dataUrl = dataUrl + "type=2"
        break
      case "欧美金曲榜":
        dataUrl = dataUrl + "type=21"
        break
    }
    dataUrl = dataUrl + "&format=json&method=baidu.ting.billboard.billList"
    this.data.requestUrl = dataUrl
    this.getMusicListData(dataUrl)
    wx.showNavigationBarLoading()
  },
  getMusicListData: function (url) {
    var that = this
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function (res) {
        that.processData(res.data.song_list)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processData: function (musicData) {
    var musics = []
    for (var idx in musicData) {
      var title = musicData[idx].title
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
      }
      var author = musicData[idx].author
      if (author.length >= 9) {
        author = author.substring(0, 9) + "..."
      }
      var temp = {
        author: author,
        title: title,
        coverageUrl: musicData[idx].pic_premium,
        musicId: musicData[idx].song_id
      }
      musics.push(temp)
    }
    var totalMusics = []
    totalMusics = this.data.musics.concat(musics)
    this.setData({
      musics:totalMusics
    })
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20"
    this.data.musics = []
    this.getMusicListData(refreshUrl)
  },
  onReachBottom: function (event) {
    var totalCount = this.data.musics.length
    var nextUrl = this.data.requestUrl + "?start=" + (totalCount) + "&count=20"
    this.getMusicListData(nextUrl)
    wx.showNavigationBarLoading()
  },
  onMusicTap: function (event) {
    var musicId = event.currentTarget.dataset.musicId
    var coverageUrl = event.currentTarget.dataset.coverageUrl
    wx.navigateTo({
      url: "../music-play/music-play?id=" + musicId + "&coverageUrl=" + coverageUrl,
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

  /**
   * 页面上拉触底事件的处理函数
   */

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})