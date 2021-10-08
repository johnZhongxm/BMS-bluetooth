App({
  onLaunch: function () {
  },
  onShow: function(option) {
    // 页面出现在前台时执行
    console.log("小程序onshow，：onShow",option)
  },
   onReady: function(option) {
    // 页面首次渲染完毕时执行
    console.log("小程序onReady ，：onReady",option)
//    SendCmd()
  },
  onHide:function(){
    console.log("小程序重前台进入到后台的时候，会触发：onHide")

  },

  gloabdata:0
})
