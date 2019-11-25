// pages/music/music-play/music-play.js
const musicPlayer = wx.getBackgroundAudioManager();
const db=wx.cloud.database()
const collection=db.collection('users');
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
    isOpen:false,
    songId:"",
    hascollect:false,
    openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var musicId = options.id
    var coverageUrl = options.coverageUrl
    var url ="http://music.baidu.com/data/music/fmlink?rate=320"
    url = url + "&songIds=" + musicId +"&format=json"
    this.setData({
      songId:musicId
    })
    //获取openid
    wx.cloud.callFunction({
      name:'getOpenId',
      complete:res=>{
        console.log("yes")
        console.log(res)
      }
    })
    // collection.where({
    //   _openid:this.data.openid
    //   }).get({
    //   success(res){
    //     console.log()
    //   }
    // })
    this.getMusicData(url, coverageUrl)
  },
  getMusicData: function (url, coverageUrl) {
    var that = this
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function (res) {
        var temp=res.data
        that.processData(temp.data.songList[0], coverageUrl)
      },
      fail: function (error) {
        console.log(error)
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
  playMusicTap:function(event){
    musicPlayer.title = this.data.title
    musicPlayer.src = this.data.musicUrl
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
        changePlay:true,
        duration:temp,
        max:max
      })
    })
    musicPlayer.play()
  },
  sliderChange(event){
    var that=this
    var offset=parseInt(event.detail.value)
    musicPlayer.play()
    musicPlayer.seek(offset)
  },
  collectTap(event){
    console.log(event.currentTarget.dataset.songId)
    collection.add({
      data:{
        songId: event.currentTarget.dataset.songId
      },
      success(result){
        console.log("添加成功")
      }
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