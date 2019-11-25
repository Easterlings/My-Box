// pages/movie/movie-more/movie-more.js
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category=options.category
    var dataUrl ="https://douban-api.uieee.com"
    switch(category){
      case "正在热映":
      dataUrl=dataUrl+"/v2/movie/in_theaters"
      break
      case "即将上映":
      dataUrl = dataUrl + "/v2/movie/coming_soon"
      break
      case "豆瓣Top250":
      dataUrl = dataUrl + "/v2/movie/top250"
      break
    }
    this.data.requestUrl=dataUrl
    this.getMovieList(dataUrl)
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

  /**
   * 页面上拉触底事件的处理函数
   */

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
        that.processData(res.data)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processData: function (movieData) {
    var movies = []
    for (var idx in movieData.subjects) {
      var subject = movieData.subjects[idx]
      var title = subject.title
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
      }
      var hasScore = true
      if (subject.rating.average == 0) {
        hasScore = false
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        hasScore:hasScore
      }
      if (subject.images.large!=null){
        movies.push(temp)
      }
    }
    var totalMovies=[]
    totalMovies=this.data.movies.concat(movies)
    this.setData({
      movies: totalMovies
    })
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
  onPullDownRefresh:function(event){
    var refreshUrl=this.data.requestUrl+"?start=0&count=20"
    this.data.movies=[]
    this.getMovieList(refreshUrl)
  },
  onReachBottom:function(event){
    var totalCount=this.data.movies.length
    var nextUrl=this.data.requestUrl+"?start="+(totalCount)+"&count=20"
    this.getMovieList(nextUrl)
    wx.showNavigationBarLoading()
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId
    wx.navigateTo({
      url: "../movie-detail/movie-detail?id=" + movieId,
    })
  }
})