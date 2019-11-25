var app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        newMusics:{},
        hotMusics:{},
        europeMusics:{},
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var url1 = "http://tingapi.ting.baidu.com/v1/restserver/ting?size=3&type=1&format=json&method=baidu.ting.billboard.billList"
      this.getMusicListData(url1, "newMusics", "新歌榜")
      var url2 = "http://tingapi.ting.baidu.com/v1/restserver/ting?size=3&type=2&format=json&method=baidu.ting.billboard.billList"
      this.getMusicListData(url2, "hotMusics","热歌榜")
      var url3 = "http://tingapi.ting.baidu.com/v1/restserver/ting?size=3&type=21&format=json&method=baidu.ting.billboard.billList"
      this.getMusicListData(url3, "europeMusics", "欧美金曲榜")
      wx.showNavigationBarLoading()
    },
  getMusicListData: function (url, settedKey, categoryTitle){
        var that=this
        wx.request({
            url: url,
            method: 'GET',
            header:{
                "content-type":"json"
            },
            success:function(res){
              that.processData(res.data.song_list, settedKey, categoryTitle)
            },
            fail:function(error){
              console.log(error)
            }
        })
    },
    processData: function (musicData, settedKey, categoryTitle){
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
                  coverageUrl:musicData[idx].pic_premium,
                  musicId: musicData[idx].song_id
                }
                musics.push(temp)
            }
            var readyData={}
            readyData[settedKey]={
                arrowUrl: "/images/icon/wx_app_arrow_right.png",
                moretext:"更多",
                categoryTitle: categoryTitle,
                musics:musics
            }
            this.setData(readyData)
      if (categoryTitle == "欧美金曲榜")
        wx.hideNavigationBarLoading()
    },
    onMoreTap: function (event) {
      var category = event.currentTarget.dataset.category
      wx.navigateTo({
        url: "music-more/music-more?category=" + category,
      })
    },
    onMusicTap: function (event) {
      var musicId = event.currentTarget.dataset.musicId
      var coverageUrl = event.currentTarget.dataset.coverageUrl
      wx.navigateTo({
        url: "music-play/music-play?id=" + musicId + "&coverageUrl=" + coverageUrl,
      })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log("onReady: 页面被渲染");
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log("onShow: 页面被显示");
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log("onHide: 页面被隐藏");
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log("onUnload: 页面被卸载");
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