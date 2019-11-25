// pages/movie/movie.js
var util=require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inTheaters:{},
        comingSoon:{},
        top250:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var url = "https://douban-api.uieee.com"
        var inTheatersUrl=url+
        "/v2/movie/in_theaters"+"?start=0&count=3"
        var comingSoonUrl=url+
        "/v2/movie/coming_soon" + "?start=0&count=3"
        var top250Url = url +
        "/v2/movie/top250" + "?start=0&count=3"
        this.getMovieList(inTheatersUrl,"inTheaters","正在热映")
        this.getMovieList(comingSoonUrl,"comingSoon","即将上映")
        this.getMovieList(top250Url,"top250","豆瓣Top250")
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
  getMovieList: function (url, settedKey, categoryTitle) {
    var that = this
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function (res) {
        console.log("request success")
        that.processData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  processData: function (movieData, settedKey, categoryTitle) {
    var movies = []
    console.log(categoryTitle)
    for (var idx in movieData.subjects) {
      var subject = movieData.subjects[idx]
      var title = subject.title
      if (title.length >= 6) {
        title = title.substring(0, 6) + "..."
      }
      var hasScore=true
      if (subject.rating.average == 0){
        hasScore = false
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        hasScore:hasScore,
        word:'暂无评分'
      }
      movies.push(temp)
    }
    var readyData = {}
    readyData[settedKey] = {
      moretext: "更多",
      arrowUrl: "/images/icon/wx_app_arrow_right.png",
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData)
    if (categoryTitle == "豆瓣Top250")
    wx.hideNavigationBarLoading()
  },
  onMoreTap:function(event){
    var category=event.currentTarget.dataset.category
    wx.navigateTo({
      url: "movie-more/movie-more?category="+category,
    })
  },
  onMovieTap:function(event){
    var movieId=event.currentTarget.dataset.movieId
    wx.navigateTo({
      url: "movie-detail/movie-detail?id="+movieId,
    })
  }
})