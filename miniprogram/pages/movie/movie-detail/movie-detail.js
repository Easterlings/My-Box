// pages/movie/movie-detail/movie-detail.js
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId=options.id
    var url = "https://douban-api.uieee.com/v2/movie/subject/"+movieId
    this.getMovieList(url)
    wx.showNavigationBarLoading()
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

  },
  getMovieList: function (url) {
    var that = this
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function (res) {
        console.log("request success")
        that.processData(res.data)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processData: function (movieData) {
    if (!movieData){
      return
    }
    var director={
      avatar:"",
      name:"",
      id:""
    }
    if(movieData.directors[0]!=null){
      if(movieData.directors[0].avatars!=null){
        director.avatar = movieData.directors[0].avatars.large
      }
      director.name = movieData.directors[0].name
      director.id = movieData.directors[0].id
    }
    var hasScore = true
    if (movieData.rating.average == 0) {
      hasScore = false
    }
    var movie={
      movieImg: movieData.images ? movieData.images.large:"",
      country: movieData.countries[0],
      title: movieData.title,
      originalTitle: movieData.original_title,
      year: movieData.year,
      generes:movieData.genres.join('、'),
      stars: util.convertToStarsArray(movieData.rating.stars),
      score:movieData.rating.average,
      director:director,
      word1:'评分',
      word2:'导演',
      word3:'演员',
      word4:'类型',
      word5:'剧情简介',
      word6:'暂无评分',
      word7:'演员',
      casts: util.convertToCastString(movieData.casts),
      castsInfo: util.convertToCastInfos(movieData.casts),
      summary:movieData.summary,
      hasScore:hasScore
    }
    console.log("movie.stars")
    this.setData({
      movie:movie
    })
    wx.hideNavigationBarLoading()
  },
})