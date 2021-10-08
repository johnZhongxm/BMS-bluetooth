
Page({
    submit: function(e){
        wx.request({
          url: '接口',
          data:{
            username:e.detail.value.username,
            password:e.detail.value.pwd
          },
          success:function(res){
            if(res.statusCode ==200){
              if(res.data.error == true){
                wx.showToast({
                  title: '网络错误',
                  icon: 'none',
                  duration:2000
                })
              }else{
                wx.setStorage({
                  key: 'user',
                  data: 'res.data.user',
                });
                wx.showToast({
                  title:"登录成功",
                  icon:"Yes",
                  duration:2000,
                  success:function(){
                    setTimeout(function(){
                      wx.switchTab({
                        url: '../index/index',
                      },2000)
                    })
                  }
                })
              }
            }
          }
        })
      },
    globledataADD(){
        var app = getApp()
        app.gloabdata =  app.gloabdata+1
    },

    })


