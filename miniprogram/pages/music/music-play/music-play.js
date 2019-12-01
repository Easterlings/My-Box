// pages/music/music-play/music-play.js
const musicPlayer = wx.getBackgroundAudioManager();
const db=wx.cloud.database()
const collection=db.collection('users');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    author: "",
    title: "",
    originalTitle:"",
    coverageUrl: "",
    musicUrl: "",
    isOpen:true,
    songId:"",
    hascollect:false,
    removeId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var musicId = options.id
    var coverageUrl = options.coverageUrl
    this.setData({
      songId:musicId
    })
    //在数据库中查找收藏记录
    var that=this
    collection.where({
      _openid:app.globalData.openid,
      songId:musicId
      }).get({
      success(res){
        if(res.data!=null){
          that.setData({
            hascollect:true,
            removeId:res.data[0]._id
          })
        }
      }
    })
    console.log(musicId)
    var url = "http://music.baidu.com/data/music/fmlink?rate=320"
    url = url + "&songIds=" + musicId+"&format=json"
    //云函数访问http网站
    wx.cloud.callFunction({
      name: 'getHttp',
      data: {
        url: url
      },
      success: res => {
        var musicData = JSON.parse(res.result)
        console.log(musicData)
        that.processData(musicData.data.songList[0], coverageUrl)
        that.playMusic()
      },
      fail:function(error){
      }
    })
  },
  processData: function (musicData, coverageUrl) {
    var title = musicData.songName
    if (title.length >= 6) {
      title = title.substring(0, 6) + "..."
    }
    var author = musicData.artistName
    if (author.length >= 9) {
      author = author.substring(0, 9) + "..."
    }
    var originalTitle=musicData.songName
    var musicUrl=musicData.songLink
    this.setData({
      author: author,
      title: title,
      originalTitle: originalTitle,
      coverageUrl: coverageUrl,
      musicUrl: musicUrl
    })
  },
  playMusicTap: function (event){
    musicPlayer.play()
    console.log("继续播放")
    this.setData({
      isOpen: true
    })
    app.globalData.isplay=true
  },
  playMusic:function(event){
    if (app.globalData.isplay==true&&app.globalData.songId == this.data.songId){
    }
    else
    {
      musicPlayer.title = this.data.title
      musicPlayer.src = this.data.musicUrl
      console.log(this.data.musicUrl)
      musicPlayer.coverImgUrl = this.data.coverageUrl
      app.globalData.isplay = true
    }
    musicPlayer.onTimeUpdate(()=>{
      var currentTime=parseInt(musicPlayer.currentTime)
      var min="0"+parseInt(currentTime/60);
      var sec=currentTime%60
      if(sec<10)
      {
        sec="0"+sec;
      }
      var startTime=min+":"+sec
      var duration = parseInt(musicPlayer.duration)
      var max1 = "0" + parseInt(duration / 60);
      var sec1 = duration % 60
      if (sec1 < 10) {
        sec1 = "0" + sec1;
      }
      var temp = max1 + ":" + sec1
      var max = parseInt(musicPlayer.duration)
      this.setData({
        startTime:startTime,
        offset: currentTime,
        duration:temp,
        max:max
      })
    })
    musicPlayer.onEnded(()=>{
      this.setData({
        startTime:"00:00",
        isOpen:false,
        offset:0
      })
      app.global.isplay = false
    })
    musicPlayer.play()
    this.setData({
      isOpen:true
    })
    app.globalData.isplay = true
  },
  pauseMusicTap:function(event){
    console.log("暂停成功")
    wx.pauseBackgroundAudio()
    this.setData({
      isOpen: false
    })
    app.globalData.isplay = false
  },
  sliderChange(event){
    var that=this
    var offset=parseInt(event.detail.value)
    musicPlayer.seek(offset)
    musicPlayer.play()
  },
  collectTap(event){
    console.log(this.data.hascollect)
    var that = this
    if (!this.data.hascollect){
      collection.add({
        data: {
          songId: event.currentTarget.dataset.songId,
          author: event.currentTarget.dataset.author,
          title: event.currentTarget.dataset.title,
          coverageUrl: event.currentTarget.dataset.coverageUrl,
        },
        success(result) {
          console.log("添加成功")
          that.setData({
            hascollect:true,
          })
        }
      })
    }
    else{
      collection.where({
        _openid: app.globalData.openid,
        songId: that.data.songId
      }).get({
        success(res) {
          if (res.data != null) {
            var removeName = res.data[0]._id
            console.log(removeName)
            collection.doc(removeName).remove({
              success(res) {
                console.log("删除成功")
                that.setData({
                  hascollect: false
                })
              }
            })
          }
        }
      })
    }
    wx.showToast({
      title: this.data.hascollect?"取消成功":"收藏成功",
      duration:1000,
      icon:"success",
      mask:true
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
    app.globalData.songId = this.data.songId
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